import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setConcurrency(null);

Config.overrideFfmpegCommand(({args}) => {
  return args.map((a) => (a === 'libfdk_aac' ? 'aac' : a));
});
