import React, { useState } from 'react';

function App() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes('@') || password.length < 6) {
      alert('有効なメールアドレスと英数字6文字以上のパスワードを入力してください。');
      return;
    }
    alert('新規登録が完了しました！');
  };

  return (
    <div style={{ height: '100vh', textAlign: 'center', backgroundColor: '#ffffff' }}>
      <h1 style={{ marginTop: '40px', fontSize: '3rem', fontWeight: 'bold' }}>Out Fit</h1>
      <p style={{ marginBottom: '40px' }}>あなたらしい色合わせを見つけましょう</p>

      <form style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }} onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', textAlign: 'left', marginBottom: '10px' }}>メールアドレス</label>
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #000',
              borderRadius: '10px',
            }}
            required
          />
        </div>
        <div style={{ marginBottom: '20px', position: 'relative' }}>
          <label style={{ display: 'block', textAlign: 'left', marginBottom: '10px' }}>パスワード</label>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="パスワード (英数字6文字以上)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #000',
              borderRadius: '10px',
            }}
            required
          />
          <i
            className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '10px',
              top: '55%',
              cursor: 'pointer',
              fontSize: '24px',
              color: '#333',
            }}
          ></i>
        </div>
        <p style={{ color: 'red', marginBottom: '20px' }}>
          有効なメールアドレスを入力してください。
          <br />
          パスワードは英数字6文字以上で設定してください。
        </p>
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '15px',
            backgroundColor: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '1.2rem',
          }}
        >
          新規登録
        </button>
      </form>

      <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            style={{
              width: '50px',
              height: '50px',
              backgroundColor: '#333',
              margin: '5px',
              borderRadius: '5px',
            }}
          >
            <span style={{ color: '#fff', lineHeight: '50px' }}>♀</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
