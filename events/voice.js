const { default: axios } = require('axios');
const fs = require('fs');
require('dotenv').config();

module.exports = async function voiceEvent(bot, msg) {
  const folderId = process.env.Y_FOLDER_ID;
  const yandexToken = process.env.Y_IAM_TOKEN;
  // Получаем информацию о файле аудио через Telegram API
  const fileID = msg.voice.file_id;

  try {
    // Get file path from Telegram API
    const fileRes = await bot.getFile(fileID);

    const filePath = fileRes.file_path;
    const fileURL = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${filePath}`;

    // Download the voice file
    const response = await axios.get(fileURL, { responseType: 'arraybuffer' });

    // Speech recognition using Yandex.Cloud
    const yandexResponse = await axios.post(
      `https://stt.api.cloud.yandex.net/speech/v1/stt:recognize?lang=ru-RU&folderId=${folderId}&format=oggopus`,
      response.data,
      {
        headers: {
          Authorization: `Api-Key ${yandexToken}`,
          'Content-Type': 'audio/ogg',
        },
      }
    );

    const resultText = yandexResponse.data.result;

    // Send the recognition result as a message
    await bot.sendMessage(msg.chat.id, resultText, {
      reply_to_message_id: msg.message_id,
    });
  } catch (error) {
    console.error(error);
  }
};
