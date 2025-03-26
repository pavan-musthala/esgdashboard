const groqApi = {
  chat: async (messages) => {
      try {
          const response = await fetch('http://localhost:3002/chat', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ messages })
          });

          const data = await response.json();
          
          if (!response.ok) {
              throw new Error(`Network response was not ok: ${JSON.stringify(data)}`);
          }

          return data;
      } catch (error) {
          console.error('Error in groqApi.chat:', error);
          throw error;
      }
  }
};

export default groqApi;