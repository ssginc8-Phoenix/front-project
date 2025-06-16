import React, { useState } from 'react';

const FileUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    // ✅ 업로드 시 category는 URL 쿼리나 서버에서 추론 방식으로 넘겨야 함
    const res = await fetch('http://localhost:8080/api/v1/file/upload?category=HOSPITAL', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      alert('업로드 실패');
      return;
    }

    const data = await res.json();
    console.log('업로드 성공:', data);
    setImageUrl(data.url); // S3의 공개 URL
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>이미지 업로드</button>
      {imageUrl && <img src={imageUrl} alt="업로드된 이미지" style={{ width: 200 }} />}
    </div>
  );
};

export default FileUploader;
