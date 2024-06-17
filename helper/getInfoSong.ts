import mongoose from "mongoose";
import { Topic } from "../api/v1/models/topic.model";
import { Singer } from "../api/v1/models/singer.model";

export const getInfoSong = async (songs: any) => {
    // Get topics of favorite songs
    const topicIds = [...new Set(songs.map((song: any) => song.topic))]
    const topics = await Topic.find({
        _id: {$in: topicIds},
        status: "active",
        deleted: false,
    }, "title slug")

    const topicMap = new Map(topics.map((topic) => [topic._id.toString(), topic]));

    // Get singers of favorite songs
    const singerIds = [...new Set(songs.map((song: any) => song.singer))];

    const singers = await Singer.find({
        _id: {$in: singerIds},
        status: "active",
        deleted: false,
    }, "fullName avatar")

    const singerMap = new Map(singers.map((singer) => [singer._id.toString(), singer]))

    // Attach topic and singer details to each song
    const favoriteSongsWithInfos = songs.map((song: any) => ({
        ...song.toObject(),
        topic: topicMap.get(song.topic.toString()),
        singer: singerMap.get(song.singer.toString()),
    }))

    return favoriteSongsWithInfos
}