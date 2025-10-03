
export type AspectRatio = '16:9' | '1:1' | '4:3' | '3:4' | '2:3' | '9:16';
export type ArtStyle = '사진' | '애니메이션' | '유화' | '수채화' | '스케치' | '디지털아트' | '3D 픽사스타일';
export type Quality = '최고화질' | '고화질' | '표준';
export type Lighting = '시네마틱' | '자연광' | '차가운' | '따뜻한';
export type ColorPalette = '선명한' | '파스텔' | '모노크롬' | '빈티지';

export interface Option<T> {
  value: T;
  label: string;
}

export interface ReferenceImage {
  data: string; // base64 string without the data URI prefix
  mimeType: string;
}
