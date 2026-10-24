import { FPS } from './theme';

export const SCENES = ['s01_hook', 's02_value', 's03_cta'] as const;
export type SceneKey = (typeof SCENES)[number];

export const VO_LEAD = 8;
export const PAUSE_AFTER = 14;
export const OUTRO_HOLD = 40;

// THỜI LƯỢNG ĐO THỰC TẾ BẰNG FFPROBE
export const VO_SEC: Record<SceneKey, number> = {
  s01_hook: 6.16,
  s02_value: 6.72,
  s03_cta: 4.64,
};

// SỐ FRAME TỪNG PHÂN ĐOẠN
export const SC: Record<SceneKey, number> = {
  s01_hook: VO_LEAD + Math.round(VO_SEC.s01_hook * FPS) + PAUSE_AFTER, // 207
  s02_value: VO_LEAD + Math.round(VO_SEC.s02_value * FPS) + PAUSE_AFTER, // 224
  s03_cta: VO_LEAD + Math.round(VO_SEC.s03_cta * FPS) + OUTRO_HOLD, // 187
};

export const TOTAL_FRAMES = SC.s01_hook + SC.s02_value + SC.s03_cta; // 618 frames = 20.6s

export const VO_TEXT: Record<SceneKey, string> = {
  s01_hook: 'Tin học... là môn dễ lấy điểm nhất kỳ thi này. Nhưng năm vừa rồi, điểm trung bình cả nước chỉ sáu phẩy không bảy. Vì sao vậy...?',
  s02_value: 'Cách sửa là học theo mạch. Một khái niệm... một ví dụ chạy thật... một câu đề tương ứng. Hiểu mạch rồi thì đề đổi kiểu nào cũng làm được.',
  s03_cta: 'Chọn Tin để thi, luyện đúng mạch từ đầu. Học Tin tại neoeducation chấm vi en',
};
