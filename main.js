global.WRITE_LOGS = process.argv.find(function(el) { return el.startsWith('--log'); })
if (global.WRITE_LOGS) {
    global.LOG_LEVEL = global.WRITE_LOGS.split("=").pop()
}



var open = require("open");

const {protocol} = require('electron');

const ProxyInterface = require('./proxy16/ipc.js')
const IpcBridge =require('./js/electron/ipcbridge.js')

const { bastyonFsFetchBridge } = require('./js/peertube/bastyon-fs-fetch.js');

const electronLocalshortcut = require('electron-localshortcut');

var win, nwin, badge, tray, proxyInterface, ipcbridge;
var willquit = false;

const { app, BrowserWindow, Menu, MenuItem, Tray, ipcMain, Notification, nativeImage, dialog, globalShortcut, OSBrowser } = require('electron')
app.allowRendererProcessReuse = false

const Badge = require('./js/vendor/electron-windows-badge.js');

// AutoUpdate --------------------------------------
const { autoUpdater } = require("electron-updater");
const log = require('electron-log');
const is = require('electron-is');
const AutoLaunch = require('auto-launch');

const contextMenu = require('electron-context-menu');

contextMenu({
    showSearchWithGoogle : false,
    showCopyImageAddress : true,
    showSaveImageAs : true,
    showInspectElement : false
})

var updatesLoading = false;

if (is.linux()) {
    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = false;
}

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

autoUpdater.on('checking-for-update', (ev) => {
    win.webContents.send('updater-message', { msg: 'checking-for-update', type: 'info', ev: ev })
})

autoUpdater.on('update-available', (ev) => {
    if (!is.linux()) updatesLoading = true
    win.webContents.send('updater-message', { msg: 'update-available', type: 'info', ev: ev, linux: is.linux(), macos: is.macOS() })
})

autoUpdater.on('update-not-available', (ev) => {
    win.webContents.send('updater-message', { msg: 'update-not-available', type: 'info', ev: ev })
})

autoUpdater.on('error', (err) => {
    win.webContents.send('updater-message', { msg: `${err}`, type: 'error' })
})

autoUpdater.on('download-progress', (ev) => {
    win.webContents.send('updater-message', { msg: 'update-available', type: 'info', ev: ev })
})

autoUpdater.on('update-downloaded', (ev) => {
    updatesLoading = false
    win.webContents.send('updater-message', { msg: 'update-downloaded', type: 'info', ev: ev })
});
//---------------------------------------------------

var appName = global.TESTPOCKETNET ? 'BastyonTest' : 'Bastyon';

let url = require('url')
let path = require('path')
const fs = require('fs');
const asyncFs = require('fs/promises');
const http = require('http');
const https = require('https');

var defaultIcon = require('path').join(__dirname, 'res/electron/icons/win/icon.ico')
var defaultTrayIcon = require('path').join(__dirname, 'res/electron/icons/win/icon.ico')
var badgeTrayIcon = require('path').join(__dirname, 'res/electron/icons/win/iconbadge.ico')
if (global.TESTPOCKETNET) {
    defaultIcon = require('path').join(__dirname, 'res/electron/icons/win/test_icon.ico')
    defaultTrayIcon = require('path').join(__dirname, 'res/electron/icons/win/test_icon.ico')
    badgeTrayIcon = require('path').join(__dirname, 'res/electron/icons/win/test_iconbadge.ico')
}

if (is.linux()) {
    defaultIcon = require('path').join(__dirname, 'res/electron/icons/png/64x64.png')
    defaultTrayIcon = require('path').join(__dirname, 'res/electron/icons/png/32x32.png')
    badgeTrayIcon = require('path').join(__dirname, 'res/electron/icons/png/iconbadge.png')
}

if (is.macOS()) {
    defaultIcon = require('path').join(__dirname, 'res/electron/icons/mac/trayTemplate.png')
    defaultTrayIcon = require('path').join(__dirname, 'res/electron/icons/mac/trayTemplate.png')
    badgeTrayIcon = require('path').join(__dirname, 'res/electron/icons/mac/traybadgeTemplate.png')
}

var protocols = ['pocketnet', 'bastyon']

function showHideWindow(show) {

    if (win === null) {

        createWindow()
        createBadge()

    } else {
        if (win.isVisible() && !show) {

            win.hide();
            destroyBadge();

        } else {

            win.show()
            createBadge()

        }
    }
}

function autoLaunchManage(enable){

    if (!is.macOS()){
        let autoLaunch = new AutoLaunch({
            name: appName,
            path: app.getPath('exe'),
            isHidden: true
        });
    
        if (enable)
            autoLaunch.enable();
    
        else 
            autoLaunch.disable();
    }
    
}


function createBadge() {

    if (badge) return

    const bo = {
        font: '10px arial',
        color: '#f7244b'
    }

    badge = new Badge(win, bo);
}

function destroyBadge() {

    if (!badge) return

    badge.destroy()
    badge = null;
}

function quit(){
    willquit = true
    app.quit()
}

function destroyApp() {
    proxyInterface.destroy().then(r => {
        quit()
    }).catch(e => {
        quit()
    })
}

function createTray() {

    var defaultImage = nativeImage.createFromPath(defaultTrayIcon);
    var badgeImage = nativeImage.createFromPath(badgeTrayIcon);

    tray = new Tray(defaultImage)

    tray.setImage(defaultImage)
    tray.setToolTip(appName);

    var contextMenu = Menu.buildFromTemplate([{
        label: 'Open',
        click: function() {
            showHideWindow(true)
        }
    }, {
        label: 'Quit',
        click: function() {

            if (ipcbridge)
                ipcbridge.destroy()

            // Check safe destroy
            if (proxyInterface)
                proxyInterface.candestroy().then(e => {
                    if (!e.includes('nodeControl')) { // Destroy all
                        destroyApp()
                    } else { // Need first stop node
                        dialog.showMessageBox(null, {
                            type: 'question',
                            buttons: ['Cancel', 'Yes, close'],
                            defaultId: 1,
                            title: 'Warning',
                            message: 'Your node is running. Close the app anyway?',
                        }).then(r => {
                            if (r.response == 1) {
                                proxyInterface.nodeStop().then(e => {
                                    destroyApp()
                                })
                            }
                        })
                    }

                })
        }
    }]);

    tray.setContextMenu(contextMenu);

    if (is.macOS()) {
        app.dock.setMenu(contextMenu)
        app.on('activate', () => {
            showHideWindow(true)
        })
    }

    tray.on('click', () => {
        if (!is.macOS())
            showHideWindow()
    })

    ipcMain.on('update-badge-tray', function(e, c) {
        if (!tray) return;

        if (!c) {
            tray.setImage(defaultImage)
        }

        if (c) {
            tray.setImage(badgeImage)
        }
    })

    /*win.on('show', () => {
        if (!tray) return;
        try {
            tray.setHighlightMode('always')
        } catch {}
    })

    win.on('hide', () => {
        if (!tray) return;
        try {
            tray.setHighlightMode('never')
        } catch {}
    })*/
}

function destroyTray() {

    if (!tray) return

    tray.destroy()
    tray = null;

}

function createBadgeOS() {
    if (is.linux() || is.macOS()) {

        // Linux or macOS
        ipcMain.on('update-badge', (event, badgeNumber) => {
            if (badgeNumber) {
                app.setBadgeCount(badgeNumber);
                if (is.macOS())
                    app.dock.setBadge(badgeNumber.toString())
            } else {
                app.setBadgeCount(0);
                if (is.macOS())
                    app.dock.setBadge('')
            }

            event.returnValue = 'success';
        });
    }

    if (is.windows()) {
        // Windows use plugin electron-windows-badge
        createBadge();
    }
}

function initApp() {

    app.commandLine.appendSwitch('ignore-certificate-errors', 'true');

    createWindow();

    createBadgeOS();

    createTray();

    var isDevelopment = process.argv.find(function(el) { return el == '--development'; })

    if (isDevelopment) {
        //win.toggleDevTools();
    } else {

        log.info('First check updates...');

        autoUpdater.checkForUpdates();

        setInterval(() => {
            autoUpdater.checkForUpdates();
        }, 10 * 60 * 1000);
    }

    const { powerMonitor } = require('electron')

    powerMonitor.on('suspend', () => {

        win.webContents.send('pause-message', { msg: 'pause', type: 'info' })

    })

    powerMonitor.on('resume', () => {

        win.webContents.send('resume-message', { msg: 'resume', type: 'info' })

    })

}

function closeNotification() {
    if (nwin) {
        nwin.destroy()

        nwin = null;
    }
}

function notification(nhtml, p) {

    if (is.macOS()) {
        return
    }

    const screen = require('electron').screen;
    const mainScreen = screen.getPrimaryDisplay();

    if (nwin) {
        nwin.destroy()

        nwin = null;
    }

    var w =  Math.min(mainScreen.size.width / 3, 510)
    var h = 135;

    if(!p) p = {}
    if (p.size == 'medium') h = 110
    if (p.size == 'small') h = 90

    nwin = new BrowserWindow({
        width: w,
        height: h,
        frame: false,
        title: 'New notification',
        x: mainScreen.size.width - w - 5,
        y: 5,
        skipTaskbar: true,
        useContentSize: true,
        resizable: false,
        movable: false,
        backgroundColor: '#020E1B',
        alwaysOnTop: true,
        show: false,
        focusable: false,
        parent : win,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            enableRemoteModule: true
        }
    })

    nwin.loadFile('notifications.html', {
        search: encodeURIComponent(nhtml)
    })



    setTimeout(function() {
        if (nwin){  
            nwin.show()

            nwin.on('hide', function(){
                win.webContents.send('win-hide')
            })

            nwin.on('minimize', function(){
                win.webContents.send('win-minimize')
            })

            nwin.on('restore', function(){
                win.webContents.send('win-restore')
            })
        }
           


       // nwin.webContents.toggleDevTools()
    }, 300)

    setTimeout(closeNotification, 15000)
}

function createWindow() {
    const screen = require('electron').screen;
    const mainScreen = screen.getPrimaryDisplay();

    win = new BrowserWindow({
        width: mainScreen.size.width,
        height: mainScreen.size.height,
        // electronnav

        /*titleBarStyle: 'hidden',
        titleBarOverlay: {
            color : "#FFFFFF",
            symbolColor : "#333333"
        },*/
        title: appName,
        webSecurity: false,

        icon: defaultIcon,

        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            enableRemoteModule: true,
            allowRendererProcessReuse: false,
            spellcheck: true
        }
    });

    // win.webContents.session.setSpellCheckerLanguages(['en-US'])
    // const possibleLanguages = win.webContents.session.availableSpellCheckerLanguages


    win.webContents.session.setSpellCheckerLanguages(['en-US', 'ru'])

    electronLocalshortcut.register(win, 'f5', function() {
		win.reload()
        win.loadFile('index_el.html')
	})
    
	electronLocalshortcut.register(win, 'CommandOrControl+R', function() {
		win.reload()
        win.loadFile('index_el.html')
	})

    win.webContents.on('context-menu', (event, params) => {
        const menu = new Menu()

        // Add each spelling suggestion
        for (const suggestion of params.dictionarySuggestions) {


          menu.append(new MenuItem({
            label: suggestion,
            click: () => win.webContents.replaceMisspelling(suggestion)
          }))
        }
      
        // Allow users to add the misspelled word to the dictionary
        if (params.misspelledWord) {
          menu.append(
            new MenuItem({
              label: 'Add to dictionary',
              click: () => win.webContents.session.addWordToSpellCheckerDictionary(params.misspelledWord)
            })
          )
        }
      
        //menu.popup()
    })

    let isHidden = process.argv.find(function(el) { return el == '--hidden'; })
    if (isHidden) {
        win.hide();
    } else {
        win.maximize();
    }

    if(is.macOS()){

        var isMac = true

        const template = [
            // { role: 'appMenu' }
            ...(isMac ? [{
              label: app.name,
              submenu: [
              
                { type: 'separator' },
                { role: 'hide', accelerator: 'Cmd+W', },
                { role: 'unhide' },
                { type: 'separator' },
                {
                    label: 'Quit',
                    accelerator: 'Cmd+Q',
                    click: async () => {
                      quit()
                    }
                }
              ]
            }] : []),
            // { role: 'fileMenu' }
            
            {
              label: 'Edit',
              submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                ...(isMac ? [
                  { role: 'pasteAndMatchStyle' },
                  { role: 'delete' },
                  { role: 'selectAll' },
                  { type: 'separator' },
                  {
                    label: 'Speech',
                    submenu: [
                      { role: 'startSpeaking' },
                      { role: 'stopSpeaking' }
                    ]
                  }
                ] : [
                  { role: 'delete' },
                  { type: 'separator' },
                  { role: 'selectAll' }
                ])
              ]
            },
            // { role: 'viewMenu' }
            {
              label: 'View',
              submenu: [
            
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
              ]
            },
            // { role: 'windowMenu' }
            {
              label: 'Window',
              submenu: [
                { role: 'minimize' },
                { role: 'zoom' },
                ...(isMac ? [
                  { type: 'separator' },
                  { role: 'front' },
                  { type: 'separator' },
                  { role: 'window' }
                ] : [
                  { role: 'close' }
                ])
              ]
            },
            {
              role: 'help',
              submenu: [
                {
                  label: 'Help center',
                  accelerator: 'Cmd+H',
                  click: async () => {
                    win.webContents.send('nav-message', { msg: 'help', type: 'action'})
                    }
                }
              ]
            }
          ]

          const menu = Menu.buildFromTemplate(template)
          Menu.setApplicationMenu(menu)
    }
    else{
        Menu.setApplicationMenu(null)
    }
    

    win.loadFile('index_el.html')

    electronLocalshortcut.register(win, 'CommandOrControl+Shift+I', () => {
        win.webContents.toggleDevTools()
    });

    win.webContents.on('new-window', function(event, url) {
        event.preventDefault();
        open(url);
    });

    win.on('close', function(e) {
        if (!willquit) {

            e.preventDefault();
            
            if (is.macOS()){
                if (win.isFullScreen()){
                    win.setFullScreen(false)
                    return
                }
            }

            
            win.hide();
            destroyBadge()
        } else {
            destroyBadge()
            destroyTray()
            win = null
        }
    });

    win.webContents.session.webRequest.onHeadersReceived({ urls: [] }, (detail, callback) => {
        const xFrameOriginKey = Object.keys(detail.responseHeaders).find(header => String(header).match(/^x-frame-options$/i));

        if (xFrameOriginKey) {
            delete detail.responseHeaders[xFrameOriginKey];
        }

        callback({ cancel: false, responseHeaders: detail.responseHeaders });
    });


   

    ipcMain.on('electron-notification', function(e, p) {

        notification(p.html, p.settings || {})

    })

    ipcMain.on('electron-notification-close', function(e) {

        closeNotification()

    })

    ipcMain.on('electron-notification-click', function(e) {

        if (win) {
            win.show();
        }

        closeNotification()

    })

    ipcMain.on('quitAndInstall', function(e) {

        willquit = true

        if (proxyInterface)
            proxyInterface.destroy().then(r => {
                autoUpdater.quitAndInstall(true, true)
            })

        if (ipcbridge)
            ipcbridge.destroy()

    })

    ipcMain.on('electron-checkForUpdates', function(e) {
        autoUpdater.checkForUpdates();
    })


    ipcMain.on('electron-autoLaunchManage', function(e, p) {

        console.log('autoLaunchManage', p)

        autoLaunchManage(p.enable)
    })

    ipcMain.handle('saveShareData', async (event, shareData) => {
        const storage = app.getAppPath();

        const shareDir = `${storage}/posts/${shareData.id}`;
        const jsonDir = `${shareDir}/share.json`;

        if (!fs.existsSync(shareDir)) {
            fs.mkdirSync(shareDir, { recursive: true });
        }

        const jsonData = JSON.stringify(shareData);

        await asyncFs.writeFile(jsonDir, jsonData, { overwrite: false });

        return shareDir;
    });

    ipcMain.handle('saveShareVideo', async (event, folder, videoData, videoResolution) => {
        function downloadFile(url, options = {}) {
            return new Promise((resolve, reject) => {
                let isHttps = /^https:/;
                let isHttp = /^http:/;

                const handler = (response) => {
                    let data = '';

                    response.on('data', (chunk) => (
                        data += chunk
                    ));

                    if (options.stream) {
                        options.stream.on('close', () => resolve(data));

                        response.pipe(options.stream);
                    } else {
                        response.on('end', () => resolve(data));
                    }
                };

                const reqOptions = {
                    headers: options.headers,
                };

                if (isHttp.test(url)) {
                    if (options.headers) {
                        http.get(url, reqOptions, handler);
                    } else {
                        http.get(url, handler);
                    }
                } else if (isHttps.test(url)) {
                    if (options.headers) {
                        https.get(url, reqOptions, handler);
                    } else {
                        https.get(url, handler);
                    }
                } else {
                    reject('Unsupported protocol');
                }
            });
        }

        const videoDir = `${folder}/videos/${videoData.uuid}`;
        const jsonDir = `${videoDir}/info.json`;
        const signsDir = `${videoDir}/signatures.json`;
        const playlistDir = `${videoDir}/playlist.m3u8`;

        const streamsRegexp = /^.+\.m3u8/gm;
        const videoTargetFile = /#EXT-X-MAP:URI="(.+\.mp4)"/m;
        const bytesRangesSelect = /(?!BYTERANGE)(\d+@\d+)/gm;

        if (!fs.existsSync(videoDir)) {
            fs.mkdirSync(videoDir, { recursive: true });
        }

        const jsonData = JSON.stringify(videoData);
        await asyncFs.writeFile(jsonDir, jsonData, { overwrite: false });

        const playlistUrl = videoData.streamingPlaylists[0].playlistUrl;
        const signsUrl = videoData.streamingPlaylists[0].segmentsSha256Url;

        const streamsData = await downloadFile(playlistUrl);

        const signsFile = fs.createWriteStream(signsDir);
        await downloadFile(signsUrl, { stream: signsFile });

        const streamsList = streamsData.match(streamsRegexp);

        const targetStream = streamsList.find((stream) => (
            stream.endsWith(`${videoResolution}.m3u8`)
        ));

        const urlLastCut = playlistUrl.lastIndexOf('/');
        const targetStreamBaseUrl = playlistUrl.substring(0, urlLastCut);
        const targetStreamUrl = `${targetStreamBaseUrl}/${targetStream}`;

        const fragmentsFile = fs.createWriteStream(playlistDir);
        const fragmentsData = await downloadFile(targetStreamUrl, { stream: fragmentsFile });
        const fragmentsList = fragmentsData.match(bytesRangesSelect);

        const targetVideo = fragmentsData.match(videoTargetFile)[1];

        const targetVideoUrl = `${targetStreamBaseUrl}/${targetVideo}`;

        for(let i = 0; i < fragmentsList.length; i++) {
            let fragRange = fragmentsList[i].split('@');
            fragRange = fragRange.reverse();

            const fragSize = Number.parseInt(fragRange[1]);
            const startBytes = Number.parseInt(fragRange[0]);
            const endBytes = fragSize + startBytes - 1;

            const fragName = `fragment_${startBytes}-${endBytes}`;
            const fragPath = `${videoDir}/${fragName}.mp4`;

            const fragFile = fs.createWriteStream(fragPath);

            await downloadFile(targetVideoUrl, {
                stream: fragFile,
                headers: {
                    range: `bytes=${startBytes}-${endBytes}`,
                },
            });
        }

        const videoInfo = {
            thumbnail: 'https://' + videoData.from + videoData.thumbnailPath,
            videoDetails : videoData,
        };

        const urlSplits = videoInfo.videoDetails.streamingPlaylists[0].playlistUrl;
        const videoId = urlSplits[urlSplits.length - 2];

        const result = {
            video: {
                internalURL: videoInfo.videoDetails.streamingPlaylists[0].playlistUrl,
            },
            infos: videoInfo,
            id: videoData.uuid,
        };

        return result;
    });

    ipcMain.handle('deleteShareWithVideo', async (event, shareId) => {
        const storage = app.getAppPath();

        const shareDir = `${storage}/posts/${shareId}`;

        fs.rmSync(shareDir, { recursive: true, force: true });
    });

    ipcMain.handle('getShareList', async (event) => {
        const isShaHash = /[a-f0-9]{64}/;

        const storage = app.getAppPath();

        const postsDir = `${storage}/posts`;

        if (!fs.existsSync(postsDir)) {
            fs.mkdirSync(postsDir);
        }

        const postsList = fs.readdirSync(postsDir)
            .filter(fN => isShaHash.test(fN));

        return postsList;
    });

    ipcMain.handle('getShareData', async (event, shareId) => {
        const storage = app.getAppPath();

        const shareDir = `${storage}/posts/${shareId}`;
        const jsonPath = `${shareDir}/share.json`;

        const jsonData = fs.readFileSync(jsonPath, { encoding:'utf8', flag:'r' });

        return JSON.parse(jsonData);
    });

    /* ipcMain.handle('getVideosList', async (event) => {
        const isUuid4 = /[a-f0-9]{8}-?[a-f0-9]{4}-?4[a-f0-9]{3}-?[89ab][a-f0-9]{3}-?[a-f0-9]{12}/;

        const storage = app.getAppPath();

        const videoDir = `${storage}/videos`;

        if (!fs.existsSync(videoDir)) {
            fs.mkdirSync(videoDir);
        }

        const videosList = fs.readdirSync(videoDir)
            .filter((fN) => (
                isUuid4.test(fN)
            ));

        return videosList;
    }); */

    ipcMain.handle('getVideoData', async (event, shareId, videoId) => {
        const storage = app.getAppPath();

        const videoDir = `${storage}/posts/${shareId}/videos/${videoId}`;

        const jsonPath = `${videoDir}/info.json`;

        const videosList = fs.readdirSync(videoDir);

        const videoData = {};

        videoData.id = videoId;

        const jsonData = fs.readFileSync(jsonPath, { encoding:'utf8', flag:'r' });

        videoData.infos = JSON.parse(jsonData);

        const videoName = videosList.find(fN => (
            fN.endsWith('.m3u8')
        ));

        const videoPath = `${videoDir}/${videoName}`;

        const videoStats = fs.statSync(videoPath);

        videoData.size = videoStats.size;
        videoData.video = {
            internalURL: videoData.infos.streamingPlaylists[0].playlistUrl,
        };

        return videoData;
    });

    ipcMain.handle('VideoManager : LoadFile', async (event, requestData) => {
        const { url, responseType, range } = requestData;

        console.log(requestData);

        const isPlaylist = url.endsWith('.m3u8');
        const isFragment = url.endsWith('.mp4');

        const storage = app.getAppPath();

        const urlSplits = url.split('/');
        const videoId = urlSplits[urlSplits.length - 2];

        const videoPath = `${storage}/videos/${videoId}`;

        let filePath;

        if (isPlaylist) {
            filePath = `${videoPath}/playlist.m3u8`;
        } else if (isFragment) {
            const rangeBytes = range.match(/\d+/g);

            const fragmentFile = `fragment_${rangeBytes[0]}-${rangeBytes[1]}.mp4`;
            filePath = `${videoPath}/${fragmentFile}`;
        }

        if (fs.existsSync(filePath)) {
            let fileData;

            if (responseType === 'arraybuffer') {
                fileData = fs.readFileSync(filePath, { flag: 'r' });
            } else if (responseType === 'text') {
                fileData = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' });
            }

            return {
                response: fileData,
                responseURL: url,
            };
        }

        return 'No downloaded file found';
    });

    /**
     * Local files requestor bridge
     */
    bastyonFsFetchBridge(ipcMain, app.getAppPath());

    proxyInterface = new ProxyInterface(ipcMain, win.webContents)
    proxyInterface.init()


    ipcbridge = new IpcBridge(ipcMain, win.webContents)

    ipcbridge.actions.autoLaunchIsEnabled = function(d){

        console.log('autoLaunchIsEnabled', d)

        if (is.macOS()){
            return Promise.resolve(false)
        }

        let autoLaunch = new AutoLaunch({
            name: appName,
            path: app.getPath('exe'),
            isHidden: true
        });

        return autoLaunch.isEnabled().catch(e =>{
            return Promise.resolve(false)
        })
    }

    ipcbridge.init()

    // Вызывается, когда окно будет закрыто.
    return win
}

var _openlink = function(l, ini){
    if(_.find(protocols, function(p){
        if(l && l.indexOf(p + "://") > -1) return true
    })){
        var href = l

        _.each(protocols, function(p){
            href = href.replace(p + "://electron/",'').replace(p + "://",'')

            if(l.indexOf(p + "://") > -1) return true
        })

        if (href && href[href.length - 1] == '/') href = href.substr(0, href.length - 1)

        if(!href) href = 'index'

        setTimeout(function(){

            win.webContents.send('nav-message', { msg: href, type: 'action'})

        }, ini ? 3000 : 5)
    }
}

var openlink = function(argv, ini){

    var l = null

    if (argv && argv.length && argv[argv.length - 1] && argv[argv.length - 1]){
        l = argv && argv.length && argv[argv.length - 1] && argv[argv.length - 1]
    }


    _openlink(l, ini)
    
}

var r = app.requestSingleInstanceLock()

if(!r) {
    app.quit()
} else {

    openlink(process.argv, true)
    
    app.on('second-instance', function(event, argv, cwd) {

        openlink(argv)

        if (win) {

            if (win.isMinimized()) win.restore();

            win.show()
            win.focus();
        }
    })

    _.each(protocols, function(protocol){
        app.setAsDefaultProtocolClient(protocol, process.execPath, [path.resolve(process.argv[1] || '.') ]); 
    })

    app.on('ready', initApp)

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    })

    app.on('activate', () => {
        if (win === null) {
            createWindow()
        }
    })
    
    if (is.macOS()){
        app.on('open-url', (event, url) => {

            _openlink(url, false)
    
            if (win) {
    
                if (win.isMinimized()) win.restore();
    
                win.show()
                win.focus();
            }
        })
    }

    




}