import React, { useState } from 'react';
import styled from 'styled-components';

const FormContainer = styled.form`
  background: ${({ theme }) => theme.colors.lightGray};
  padding: 25px;
  border-radius: 8px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const FormTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.colors.primary};
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-family: inherit;
  font-size: 16px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-family: inherit;
  font-size: 16px;
  height: 100%;
  resize: none;
`;

const SubmitButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  padding: 12px 25px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.3s;
  
  &:hover {
    opacity: 0.9;
  }
`;

const ContactForm: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const botToken = process.env.REACT_APP_TELEGRAM_BOT_TOKEN; // <-- твой токен
        const chatId = process.env.REACT_APP_TELEGRAM_CHAT_ID; // <-- твой chat_id
        console.log('env',botToken,chatId)
        const text = `
            📩 Новое сообщение с сайта:
            -----------------------------
            👤 Имя: ${formData.name}
            📧 Email: ${formData.email}
            📞 Телефон: ${formData.phone}
            💬 Сообщение: ${formData.message}
        `;

        try {
            const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: text,
                }),
            });

            if (response.ok) {
                alert("✅ Сообщение успешно отправлено!");
                setFormData({ name: '', email: '', phone: '', message: '' });
            } else {
                alert("❌ Ошибка при отправке!");
            }
        } catch (error) {
            console.error("Ошибка:", error);
            alert("⚠️ Не удалось отправить сообщение");
        }
    };



    return (
        <FormContainer onSubmit={handleSubmit}>
            <FormTitle>Напишите нам</FormTitle>

            <FormGroup>
                <Input
                    type="text"
                    name="name"
                    placeholder="Ваше имя"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </FormGroup>

            <FormGroup>
                <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </FormGroup>

            <FormGroup>
                <Input
                    type="tel"
                    name="phone"
                    placeholder="Телефон"
                    value={formData.phone}
                    onChange={handleChange}
                />
            </FormGroup>

            <FormGroup style={{height: '100%'}}>
                <TextArea
                    name="message"
                    placeholder="Сообщение"
                    value={formData.message}
                    onChange={handleChange}
                    required
                />
            </FormGroup>

            <SubmitButton type="submit">Отправить</SubmitButton>
        </FormContainer>
    );
};

export default ContactForm;