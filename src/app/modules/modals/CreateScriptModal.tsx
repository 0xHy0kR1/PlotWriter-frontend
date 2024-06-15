import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

Modal.setAppElement('#root');

interface CreateScriptModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const CreateScriptModal: React.FC<CreateScriptModalProps> = ({ isOpen, onRequestClose }) => {
  const [step, setStep] = useState(1);
  const [format, setFormat] = useState('');
  const [title, setTitle] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [genre, setGenre] = useState('');
  const [content, setContent] = useState('');
  const [socialMedia, setSocialMedia] = useState('');

  const handleNextStep = () => setStep(step + 1);
  const handlePreviousStep = () => setStep(step - 1);

  const handleSubmit = async () => {
    try {
      await axios.post('/api/scripts', {
        format,
        title,
        synopsis,
        genre,
        content,
        socialMedia,
      });
      onRequestClose(); // Close the modal after successful submission
    } catch (error) {
      console.error('Error creating script', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      {step === 1 && (
        <div>
          <h2>Select Format</h2>
          <button onClick={() => { setFormat('feature'); handleNextStep(); }}>Feature Film</button>
          <button onClick={() => { setFormat('short'); handleNextStep(); }}>Video Short</button>
        </div>
      )}
      {step === 2 && format === 'feature' && (
        <div className='text-'>
          <h2>Feature Film Details</h2>
          <label>Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          <label>Synopsis</label>
          <textarea value={synopsis} onChange={(e) => setSynopsis(e.target.value)} />
          <label>Genre</label>
          <select onChange={(e) => setGenre(e.target.value)} value={genre}>
            <option value="action">Action</option>
            <option value="comedy">Comedy</option>
            {/* Add other genres */}
          </select>
          <button onClick={handlePreviousStep}>Back</button>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
      {step === 2 && format === 'short' && (
        <div>
          <h2>Video Short Details</h2>
          <label>Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          <label>Social Media</label>
          <select onChange={(e) => setSocialMedia(e.target.value)} value={socialMedia}>
            <option value="tiktok">TikTok</option>
            <option value="instagram">Instagram Reel</option>
          </select>
          <label>Script Content</label>
          <textarea placeholder="Write a video script about..." value={content} onChange={(e) => setContent(e.target.value)} />
          <button onClick={handlePreviousStep}>Back</button>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
    </Modal>
  );
};

export default CreateScriptModal;
