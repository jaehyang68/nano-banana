
import type { Option, AspectRatio, ArtStyle, Quality, Lighting, ColorPalette } from './types';

export const ASPECT_RATIO_OPTIONS: Option<AspectRatio>[] = [
  { value: '16:9', label: '16:9' },
  { value: '1:1', label: '1:1' },
  { value: '4:3', label: '4:3' },
  { value: '3:4', label: '3:4' },
  { value: '2:3', label: '2:3' },
  { value: '9:16', label: '9:16' },
];

export const ART_STYLE_OPTIONS: Option<ArtStyle>[] = [
  { value: '사진', label: '사진' },
  { value: '애니메이션', label: '애니메이션' },
  { value: '유화', label: '유화' },
  { value: '수채화', label: '수채화' },
  { value: '스케치', label: '스케치' },
  { value: '디지털아트', label: '디지털아트' },
  { value: '3D 픽사스타일', label: '3D 픽사스타일' },
];

export const QUALITY_OPTIONS: Option<Quality>[] = [
  { value: '최고화질', label: '최고화질' },
  { value: '고화질', label: '고화질' },
  { value: '표준', label: '표준' },
];

export const LIGHTING_OPTIONS: Option<Lighting>[] = [
  { value: '시네마틱', label: '시네마틱' },
  { value: '자연광', label: '자연광' },
  { value: '차가운', label: '차가운' },
  { value: '따뜻한', label: '따뜻한' },
];

export const COLOR_PALETTE_OPTIONS: Option<ColorPalette>[] = [
  { value: '선명한', label: '선명한' },
  { value: '파스텔', label: '파스텔' },
  { value: '모노크롬', label: '모노크롬' },
  { value: '빈티지', label: '빈티지' },
];
