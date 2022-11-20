const fetch = require('node-fetch');
const { exec } = require("child_process");
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ffprobe = require('node-ffprobe')
const ffprobeInstaller = require('@ffprobe-installer/ffprobe')
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg')
ffprobe.FFPROBE_PATH = ffprobeInstaller.path
ffmpeg.setFfmpegPath(ffmpegInstaller.path)
const downloadedpath = path.join('userfiles', 'downloaded')
function generateString(length) {
    const characters ='abcdefghijklmnopqrstuvwxyz';
    let result = ''
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

module.exports = {
    getfile(url) {
        return new Promise((res, rej) => {
            fetch(url).then(function(response) {
                var rand = require('@supercharge/strings').random(15);
                var ext = url.split('.')[url.split('.').length - 1];
                var path = `${downloadedpath}\\${rand}.${ext}`;
                var fileStream = fs.createWriteStream(path);
                response.body.on('error', (error) => { rej(`[GETFILE - ERROR]: ${error}`); });
                fileStream.on('finish', () => { res(path) });
                response.body.pipe(fileStream);
            });
        })
    },
    br(type, quality, url) {
        return new Promise(async (res, rej) => {
            var file = await this.getfile(url);
            var processedfile = file.replace('downloaded', 'processed')
            var initialbr = await ffprobe(`${path.join(file)}`).catch((err) => {
                rej(`[BITRATE - ERROR (PROBE)]: ${err}`);
                return;
            })
            var bitrate = function () {let i = initialbr["streams"].findIndex(x => x["codec_type"] == type.toLowerCase()); return Math.round((((quality/100) * initialbr["streams"][i]["bit_rate"])/1000))}()

            try {
                ffmpeg(`${path.join(file)}`)[`${type}Bitrate`](bitrate).output(processedfile).on('end', function() {
                    res(processedfile)
                }).on('error', function(err, stdout, stderr) {
                    rej(`[BITRATE - ERROR (PROCESS)]: ${err}`);
                }).run();
            } catch (err) {
                rej(`[BITRATE - ERROR (PROCESS)]: ${err}`);
                return;
            }
        })
    },
    wtm(amount, type = 'all', url) {
        return new Promise(async (res, rej) => {
            var file = await this.getfile(url);
            var processedfile = file.replace('downloaded', 'processed');
            var watermarks = [
                '9gag',
                'bandicam',
                'hypercam',
                'ifunny',
                'laugh',
                'mematic',
                'memebase',
                'reddit'
            ]

            var selectedwatermarks = []
            var watermarkargs = ['[0:v]scale=640:-1[bg]']
            for (var i = 1; (i - 1) < amount; i++) {
                var watermark = Math.floor(Math.random() * 8)
                if (type != 'all') {
                    watermark = type;
                }
                switch (watermark) {
                    case 1:
                        watermarkargs.push(`[${i == 1 ? `bg` : `wtm${i - 1}`}]pad[${i}:v]overlay=(main_w-overlay_w)/2:0${i + 1 < amount ? `[wtm${i}]` : ``}`);
                        break;
                    case 2: 
                        watermarkargs.push(`[${i == 1 ? `bg` : `wtm${i - 1}`}][${i}:v]overlay=0:0${i + 1 < amount ? `[wtm${i}]` : ``}`);
                        break;
                }
                selectedwatermarks.push(watermark)
            }

            try {
                ffmpeg(`${path.join(file)}`)
                    .input(selectedwatermarks.map((w) => `${path.join('assets', 'images', 'watermark', `${watermarks[w]}.png`)}`).join('-i'))
                    .videoCodec('libx264')
                    .outputOptions('-pix_fmt yuv420p')
                    .complexFilter(watermarkargs)
                    .output(processedfile)
                    .on('end', function() {
                        res(processedfile)
                    })
                    .on('error', function(err, stdout, stderr) {
                        rej(`[WATERMARK - ERROR (PROCESS)]: ${err}`);
                    }).run();
            } catch (err) {
                rej(`[WATERMARK - ERROR (PROCESS)]: ${err}`);
                return;
            }
        })
    }
}