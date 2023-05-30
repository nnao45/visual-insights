import { IChannelType } from "./interfaces";
interface IChannel {
    name: IChannelType;
    exclusiveChannels: IChannelType[];
}
export declare const VISUAL_CHANNELS: {
    [key: string]: IChannel;
};
export {};
