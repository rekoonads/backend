import Ad from "../models/AdbidModel.js";

const generateVAST = (ad) => {
  return `
    <VAST version="2.0">
      <Ad id="${ad.id}">
        <InLine skipoffset="00:00:05">
          <AdSystem>AdGlare Ad Server</AdSystem>
          <AdTitle>${ad.advertiser}</AdTitle>
          <Impression id="${ad.id}">
            <![CDATA[${ad.impressionUrl}]]>
          </Impression>
          <Creatives>
            <Creative id="${ad.creativeId}">
              <Linear>
                <Duration>${ad.duration}</Duration>
                <TrackingEvents/>
                <VideoClicks>
                  <ClickThrough>
                    <![CDATA[${ad.clickThroughUrl}]]>
                  </ClickThrough>
                  <ClickTracking>
                    <![CDATA[${ad.clickTrackingUrl}]]>
                  </ClickTracking>
                </VideoClicks>
                <MediaFiles>
                  <MediaFile width="${ad.width}" height="${ad.height}" delivery="progressive" type="video/mp4" bitrate="${ad.bitrate}" scalable="true" maintainAspectRatio="true">
                    <![CDATA[${ad.creativeUrl}]]>
                  </MediaFile>
                </MediaFiles>
              </Linear>
            </Creative>
          </Creatives>
        </InLine>
      </Ad>
    </VAST>
  `;
};

const generateVMAP = (ads) => {
  return `
    <VMAP version="1.0">
      <AdBreak timeOffset="start" breakType="linear" breakId="preroll">
        <AdSource allowMultipleAds="false" followRedirects="true" id="1">
          <VASTAdData>
            ${generateVAST(ads[0])}
          </VASTAdData>
        </AdSource>
      </AdBreak>
      <AdBreak timeOffset="00:10:00" breakType="linear" breakId="midroll">
        <AdSource allowMultipleAds="false" followRedirects="true" id="2">
          <VASTAdData>
            ${generateVAST(ads[1])}
          </VASTAdData>
        </AdSource>
      </AdBreak>
      <AdBreak timeOffset="end" breakType="linear" breakId="postroll">
        <AdSource allowMultipleAds="false" followRedirects="true" id="3">
          <VASTAdData>
            ${generateVAST(ads[2])}
          </VASTAdData>
        </AdSource>
      </AdBreak>
    </VMAP>
  `;
};

export default async (req, res) => {
  try {
    const ads = await Ad.find().limit(3);
    const vmapXml = generateVMAP(ads);
    return res.status(200).set("Content-Type", "application/xml").send(vmapXml);
  } catch (error) {
    return res.status(500).json(error);
  }
};

