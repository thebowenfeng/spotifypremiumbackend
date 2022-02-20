var express = require('express');
var router = express.Router();

const puppeteer = require('puppeteer')
var downloader = require('youtube-mp3-converter')
var fs = require('fs')

async function getVideoID(videoName){
  if(videoName == null || videoName === ""){
    throw new Error("Video name not specified")
  }

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const response = await page.goto(`https://www.youtube.com/results?search_query=${videoName}`, {
    waitUntil: 'networkidle2'
  })

  return await page.evaluate(() => {
    return document.getElementsByTagName("ytd-video-renderer")[0].children[0].children[0].children[0].getAttribute("href").slice(9)
  })
}


/* GET users listing. */
router.get('/', async function(req, res, next) {
  let videoName = req.query.name

  try{
    var videoID = await getVideoID(videoName)
    const yt = downloader("C:/Users/85751/Desktop/Projects/freespotifybackend/music")
    const path = await yt(`https://www.youtube.com/watch?v=${videoID}`)

    res.download(path, (err) => {
      console.log("downloaded")
      fs.unlink(path, () => {console.log("deleted")})
    })
  }catch (e){
    res.status(400).send(e.message)
  }
});

module.exports = router;
