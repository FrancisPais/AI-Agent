import * as ytdl from "ytdl-core";

export async function getVideoPlayableUrl(videoId: string) {
  try {
    const info = await ytdl.getInfo(videoId);
    const playable = info.player_response?.playabilityStatus?.status || "OK";
    if (playable !== "OK") {
      return "";
    }
    const format = ytdl.chooseFormat(info.formats, {
      quality: "highest",
      filter: "audioandvideo",
    });
    if (!format.url) {
      return "";
    }
    return format.url;
  } catch {
    return "";
  }
}
