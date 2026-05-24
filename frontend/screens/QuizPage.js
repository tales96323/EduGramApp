import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { Sparkles } from 'lucide-react-native';

export default function QuizPage() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [quizMessage, setQuizMessage] = useState('');
  const [quizTopic, setQuizTopic] = useState('');
  const [generatedQuizQuestions, setGeneratedQuizQuestions] = useState([]);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [quizError, setQuizError] = useState('');

  const currentQuizQuestions = generatedQuizQuestions.length > 0 ? generatedQuizQuestions : [
    {
      question: 'Qual planeta do nosso sistema solar é conhecido como o "Planeta Vermelho"?',
      options: ['Vénus', 'Marte', 'Júpiter', 'Saturno'],
      correctAnswer: 'Marte',
    },
    {
      question: 'Quem formulou a Teoria da Relatividade?',
      options: ['Isaac Newton', 'Galileu Galilei', 'Albert Einstein', 'Stephen Hawking'],
      correctAnswer: 'Albert Einstein',
    },
    {
      question: 'Qual é o elemento químico mais abundante na crosta terrestre?',
      options: ['Ferro', 'Oxigénio', 'Silício', 'Alumínio'],
      correctAnswer: 'Oxigénio',
    },
  ];

  const currentQuestion = currentQuizQuestions[questionIndex];

  const handleAnswerClick = (answer) => setSelectedAnswer(answer);

  const handleSubmitQuiz = () => {
    setShowResult(true);
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setQuizMessage('Correto! 🎉');
    } else {
      setQuizMessage(`Incorreto. A resposta correta é: "${currentQuestion.correctAnswer}"`);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizMessage('');
    if (questionIndex < currentQuizQuestions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      setQuizMessage('Quiz finalizado! Parabéns!');
      setQuestionIndex(0);
      setGeneratedQuizQuestions([]);
    }
  };

  const generateQuiz = async () => {
    if (!quizTopic.trim()) {
      setQuizError('Por favor, insira um tópico para gerar o quiz.');
      return;
    }
    setIsLoadingQuiz(true);
    setQuizError('');
    setGeneratedQuizQuestions([]);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizMessage('');
    try {
      const prompt = `Gere um quiz de múltipla escolha com 3 perguntas sobre "${quizTopic}". Para cada pergunta, forneça 4 opções e indique qual é a resposta correta. Formate a resposta como um array JSON de objetos, onde cada objeto tem 'question' (string), 'options' (array de strings) e 'correctAnswer' (string).`;
      const payload = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                question: { type: 'STRING' },
                options: { type: 'ARRAY', items: { type: 'STRING' } },
                correctAnswer: { type: 'STRING' },
              },
              propertyOrdering: ['question', 'options', 'correctAnswer'],
            },
          },
        },
      };
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      const json = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (json) {
        const parsed = JSON.parse(json);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setGeneratedQuizQuestions(parsed);
        } else {
          setQuizError('Não foi possível gerar um quiz com o tópico fornecido. Tente outro tópico.');
        }
      } else {
        setQuizError('Erro ao gerar o quiz. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('Erro Gemini quiz:', error);
      setQuizError('Erro de rede ou servidor ao gerar o quiz. Verifique a sua conexão.');
    } finally {
      setIsLoadingQuiz(false);
    }
  };

  const optionClass = (option) => {
    let cls = 'w-full p-3 rounded-lg border-2 ';
    if (showResult && option === currentQuestion.correctAnswer) {
      cls += 'bg-green-100 border-green-500';
    } else if (showResult && selectedAnswer === option && option !== currentQuestion.correctAnswer) {
      cls += 'bg-red-100 border-red-500';
    } else if (selectedAnswer === option) {
      cls += 'bg-primary-100 border-primary-500';
    } else {
      cls += 'bg-gray-50 border-gray-200 hover:bg-gray-100';
    }
    return cls;
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16, alignItems: 'center', justifyContent: 'center' }}>
      <View className="bg-white rounded-xl shadow-md p-6 w-full max-w-md lg:max-w-2xl">
        <Text className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 text-center">
          Quiz de Conhecimento
        </Text>

        <View className="mb-6 pb-4 border-b border-gray-200">
          <Text className="text-gray-700 font-semibold mb-3">Gerar um novo Quiz por Tópico:</Text>
          <TextInput
            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 mb-3"
            placeholder="Ex: Buracos Negros, Biologia Celular..."
            value={quizTopic}
            onChangeText={setQuizTopic}
          />
          <Pressable
            onPress={generateQuiz}
            disabled={isLoadingQuiz}
            className={`w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg flex-row items-center justify-center ${isLoadingQuiz ? 'opacity-50' : ''}`}
          >
            {isLoadingQuiz ? (
              <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
            ) : (
              <Sparkles size={16} color="#fff" style={{ marginRight: 8 }} />
            )}
            <Text className="text-white font-semibold">Gerar Quiz</Text>
          </Pressable>
          {quizError ? (
            <Text className="text-red-600 text-xs mt-2 text-center">{quizError}</Text>
          ) : null}
        </View>

        {currentQuizQuestions.length > 0 && !isLoadingQuiz && !quizError ? (
          <>
            <Text className="text-gray-600 text-sm mb-6 text-center">
              Questão {questionIndex + 1} de {currentQuizQuestions.length}
            </Text>

            <View className="mb-6">
              <Text className="text-lg lg:text-xl font-semibold text-gray-900 mb-4">
                {currentQuestion.question}
              </Text>
              <View className="gap-3">
                {currentQuestion.options.map((option) => (
                  <Pressable
                    key={option}
                    onPress={() => handleAnswerClick(option)}
                    disabled={showResult}
                    className={optionClass(option)}
                  >
                    <Text className="text-gray-800">{option}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {!showResult ? (
              <Pressable
                onPress={handleSubmitQuiz}
                disabled={selectedAnswer === null}
                className={`w-full bg-primary-600 hover:bg-primary-700 py-3 rounded-lg items-center ${selectedAnswer === null ? 'opacity-50' : ''}`}
              >
                <Text className="text-white font-semibold">Verificar Resposta</Text>
              </Pressable>
            ) : (
              <View className="mt-6 items-center">
                <Text
                  className={`font-bold text-xl mb-4 text-center ${quizMessage.includes('Correto') ? 'text-green-600' : 'text-red-600'}`}
                >
                  {quizMessage}
                </Text>
                <Pressable
                  onPress={handleNextQuestion}
                  className="w-full bg-primary-600 hover:bg-primary-700 py-3 rounded-lg items-center"
                >
                  <Text className="text-white font-semibold">
                    {questionIndex < currentQuizQuestions.length - 1 ? 'Próxima Questão' : 'Reiniciar Quiz'}
                  </Text>
                </Pressable>
              </View>
            )}
          </>
        ) : (
          !isLoadingQuiz && !quizError && (
            <Text className="text-gray-500 text-center mt-4">
              Insira um tópico acima para gerar um quiz.
            </Text>
          )
        )}
      </View>
    </ScrollView>
  );
}
