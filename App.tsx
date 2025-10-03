
import React, { useState, useCallback } from 'react';
import SelectInput from './components/SelectInput';
import Spinner from './components/Spinner';
import { generateImageWithNanoBanana } from './services/geminiService';
import type { ReferenceImage, AspectRatio, ArtStyle, Quality, Lighting, ColorPalette } from './types';
import {
  ASPECT_RATIO_OPTIONS,
  ART_STYLE_OPTIONS,
  QUALITY_OPTIONS,
  LIGHTING_OPTIONS,
  COLOR_PALETTE_OPTIONS,
} from './constants';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [referenceImage, setReferenceImage] = useState<ReferenceImage | null>(null);
  const [referenceImagePreview, setReferenceImagePreview] = useState<string | null>(null);

  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [artStyle, setArtStyle] = useState<ArtStyle>('사진');
  const [quality, setQuality] = useState<Quality>('고화질');
  const [lighting, setLighting] = useState<Lighting>('자연광');
  const [colorPalette, setColorPalette] = useState<ColorPalette>('선명한');

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setReferenceImagePreview(base64String);
        const [meta, data] = base64String.split(',');
        const mimeType = meta.match(/:(.*?);/)?.[1];
        if (data && mimeType) {
          setReferenceImage({ data, mimeType });
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeReferenceImage = () => {
    setReferenceImage(null);
    setReferenceImagePreview(null);
  };

  const handleGenerateClick = useCallback(async () => {
    if (!prompt.trim()) {
      setError('생성할 이미지에 대한 설명을 입력해주세요.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    const fullPrompt = [
      prompt,
      `아트 스타일: ${artStyle}`,
      `화질: ${quality}`,
      `조명: ${lighting}`,
      `컬러 팔레트: ${colorPalette}`,
      `캔버스 사이즈: ${aspectRatio}`,
    ].join(', ');

    try {
      const imageUrl = await generateImageWithNanoBanana(fullPrompt, referenceImage);
      setGeneratedImage(imageUrl);
    } catch (err: any) {
      setError(err.message || '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, referenceImage, aspectRatio, artStyle, quality, lighting, colorPalette]);

  const handleDownloadClick = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    const fileExtension = generatedImage.split(';')[0].split('/')[1] || 'png';
    link.download = `generated-image-${Date.now()}.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            나노바나나 이미지 생성기
          </h1>
          <p className="mt-2 text-gray-400">Gemini의 Nano-banana 모델로 아이디어를 현실로 만드세요.</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Section */}
          <aside className="lg:col-span-1 bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6 h-fit">
            <h2 className="text-2xl font-bold border-b border-gray-600 pb-2">옵션 설정</h2>
            
            <SelectInput label="캔버스 사이즈" name="aspectRatio" value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value as AspectRatio)} options={ASPECT_RATIO_OPTIONS} />
            <SelectInput label="아트 스타일" name="artStyle" value={artStyle} onChange={(e) => setArtStyle(e.target.value as ArtStyle)} options={ART_STYLE_OPTIONS} />
            <SelectInput label="화질" name="quality" value={quality} onChange={(e) => setQuality(e.target.value as Quality)} options={QUALITY_OPTIONS} />
            <SelectInput label="조명" name="lighting" value={lighting} onChange={(e) => setLighting(e.target.value as Lighting)} options={LIGHTING_OPTIONS} />
            <SelectInput label="컬러 팔레트" name="colorPalette" value={colorPalette} onChange={(e) => setColorPalette(e.target.value as ColorPalette)} options={COLOR_PALETTE_OPTIONS} />

            <div>
              <label htmlFor="reference-image" className="block text-sm font-medium text-gray-300 mb-1">참고 이미지 (선택)</label>
              <input id="reference-image" type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"/>
              {referenceImagePreview && (
                <div className="mt-4 relative">
                  <img src={referenceImagePreview} alt="참고 이미지 미리보기" className="rounded-lg w-full h-auto object-cover" />
                  <button onClick={removeReferenceImage} className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-700">&times;</button>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content Section */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-gray-800 p-4 rounded-2xl shadow-lg">
                <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="생성하고 싶은 이미지에 대해 자세하게 설명해주세요. (예: 밤하늘을 나는 우주 고양이)"
                className="w-full h-28 p-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition"
                />
                 <button
                    onClick={handleGenerateClick}
                    disabled={isLoading || !prompt.trim()}
                    className="w-full mt-2 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center"
                >
                    {isLoading && <Spinner />}
                    {isLoading ? '이미지 생성 중...' : '✨ 이미지 생성하기'}
                </button>
            </div>
            
            {error && <div className="bg-red-900 border border-red-600 text-red-200 px-4 py-3 rounded-lg relative" role="alert">{error}</div>}

            <div className="bg-gray-800 p-4 rounded-2xl shadow-lg min-h-[400px] flex items-center justify-center">
              {isLoading ? (
                <div className="text-center">
                    <Spinner />
                    <p className="mt-4 text-gray-400">AI가 열심히 그림을 그리고 있어요... 잠시만 기다려주세요!</p>
                </div>
              ) : generatedImage ? (
                <div className="w-full flex flex-col items-center gap-4">
                  <img src={generatedImage} alt="Generated" className="max-w-full max-h-[60vh] rounded-lg object-contain" />
                  <button
                    onClick={handleDownloadClick}
                    className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 transition-colors duration-300"
                  >
                    이미지 다운로드
                  </button>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <p>생성된 이미지가 여기에 표시됩니다.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
