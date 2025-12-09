import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { Sparkles } from 'lucide-react-native'; // Importar Sparkles para o botão Gerar Quiz

export default function QuizPage() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [quizMessage, setQuizMessage] = useState('');
  const [quizTopic, setQuizTopic] = useState('');
  const [generatedQuizQuestions, setGeneratedQuizQuestions] = useState([]);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [quizError, setQuizError] = useState('');

  // Use generated questions if available, otherwise use default
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

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
  };

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
      setQuestionIndex(0); // Resets the quiz for demo purposes
      setGeneratedQuizQuestions([]); // Clear generated quiz
    }
  };

  // Function to generate quiz using Gemini API
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
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = {
          contents: chatHistory,
          generationConfig: {
              responseMimeType: "application/json",
              responseSchema: {
                  type: "ARRAY",
                  items: {
                      type: "OBJECT",
                      properties: {
                          "question": { "type": "STRING" },
                          "options": {
                              "type": "ARRAY",
                              "items": { "type": "STRING" }
                          },
                          "correctAnswer": { "type": "STRING" }
                      },
                      "propertyOrdering": ["question", "options", "correctAnswer"]
                  }
              }
          }
      };
      const apiKey = ""; // If you want to use models other than gemini-2.0-flash or imagen-3.0-generate-002, provide an API key here. Otherwise, leave this as-is.
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const json = result.candidates[0].content.parts[0].text;
        const parsedJson = JSON.parse(json);
        if (Array.isArray(parsedJson) && parsedJson.length > 0) {
          setGeneratedQuizQuestions(parsedJson);
        } else {
          setQuizError('Não foi possível gerar um quiz com o tópico fornecido. Tente outro tópico.');
        }
      } else {
        console.error("Erro ao gerar o quiz: Estrutura de resposta inesperada", result);
        setQuizError('Erro ao gerar o quiz. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error("Erro na chamada da API Gemini para geração de quiz:", error);
      setQuizError('Erro de rede ou servidor ao gerar o quiz. Verifique a sua conexão.');
    } finally {
      setIsLoadingQuiz(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.quizCard}>
        <Text style={styles.quizTitle}>Quiz de Conhecimento</Text>

        {/* Seção de Geração de Quiz */}
        <View style={styles.quizGenerationSection}>
          <Text style={styles.quizGenerationPrompt}>Gerar um novo Quiz por Tópico:</Text>
          <TextInput
            style={styles.quizTopicInput}
            placeholder="Ex: Buracos Negros, Biologia Celular..."
            value={quizTopic}
            onChangeText={setQuizTopic}
          />
          <TouchableOpacity
            style={[styles.generateQuizButton, isLoadingQuiz && styles.disabledButton]}
            onPress={generateQuiz}
            disabled={isLoadingQuiz}
          >
            {isLoadingQuiz ? (
              <ActivityIndicator size="small" color="#ffffff" style={styles.buttonSpinner} />
            ) : (
              <>
                <Sparkles size={16} color="#ffffff" style={styles.buttonIcon} />
                <Text style={styles.generateQuizButtonText}>Gerar Quiz</Text>
              </>
            )}
          </TouchableOpacity>
          {quizError ? <Text style={styles.errorMessage}>{quizError}</Text> : null}
        </View>

        {/* Exibir Perguntas do Quiz */}
        {currentQuizQuestions.length > 0 && !isLoadingQuiz && !quizError ? (
          <>
            <Text style={styles.questionCounter}>
              Questão {questionIndex + 1} de {currentQuizQuestions.length}
            </Text>

            <View style={styles.questionSection}>
              <Text style={styles.questionText}>{currentQuestion.question}</Text>
              <View style={styles.optionsContainer}>
                {currentQuestion.options.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      selectedAnswer === option ? styles.selectedOption : null,
                      showResult && option === currentQuestion.correctAnswer ? styles.correctOption : null,
                      showResult && selectedAnswer === option && option !== currentQuestion.correctAnswer ? styles.incorrectOption : null,
                    ]}
                    onPress={() => handleAnswerClick(option)}
                    disabled={showResult}
                  >
                    <Text style={styles.optionButtonText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {!showResult ? (
              <TouchableOpacity
                style={[styles.checkAnswerButton, selectedAnswer === null && styles.disabledButton]}
                onPress={handleSubmitQuiz}
                disabled={selectedAnswer === null}
              >
                <Text style={styles.checkAnswerButtonText}>Verificar Resposta</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.resultSection}>
                <Text style={[styles.quizMessage, quizMessage.includes('Correto') ? styles.successMessage : styles.errorMessage]}>
                  {quizMessage}
                </Text>
                <TouchableOpacity
                  style={styles.nextQuestionButton}
                  onPress={handleNextQuestion}
                >
                  <Text style={styles.nextQuestionButtonText}>
                    {questionIndex < currentQuizQuestions.length - 1 ? 'Próxima Questão' : 'Reiniciar Quiz'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          !isLoadingQuiz && !quizError && (
            <Text style={styles.noQuizText}>
              Insira um tópico acima para gerar um quiz.
            </Text>
          )
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 16, // p-4
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizCard: {
    backgroundColor: '#ffffff', // bg-white
    borderRadius: 12, // rounded-xl
    shadowColor: '#000', // shadow-md
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4, // Para Android
    padding: 24, // p-6
    width: '100%',
    maxWidth: 400, // max-w-md
  },
  quizTitle: {
    fontSize: 24, // text-2xl
    fontWeight: 'bold',
    color: '#1f2937', // text-gray-800
    marginBottom: 16, // mb-4
    textAlign: 'center',
  },
  quizGenerationSection: {
    marginBottom: 24, // mb-6
    paddingBottom: 16, // pb-4
    borderBottomWidth: 1,
    borderColor: '#e5e7eb', // border-gray-200
  },
  quizGenerationPrompt: {
    color: '#374151', // text-gray-700
    fontSize: 16, // text-md
    fontWeight: '600', // font-semibold
    marginBottom: 12, // mb-3
  },
  quizTopicInput: {
    width: '100%',
    padding: 12, // p-3
    borderWidth: 1,
    borderColor: '#d1d5db', // border-gray-300
    borderRadius: 8, // rounded-lg
    color: '#111827', // text-gray-900
    marginBottom: 12, // mb-3
  },
  generateQuizButton: {
    width: '100%',
    backgroundColor: '#9333ea', // bg-purple-600
    paddingVertical: 12, // py-3
    borderRadius: 8, // rounded-lg
    fontWeight: '600', // font-semibold
    shadowColor: '#000', // shadow-md
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4, // Para Android
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  generateQuizButtonText: {
    color: '#ffffff', // text-white
    fontWeight: '600',
  },
  buttonSpinner: {
    marginRight: 8, // -ml-1 mr-2
  },
  buttonIcon: {
    marginRight: 8,
  },
  errorMessage: {
    color: '#dc2626', // text-red-500
    fontSize: 12, // text-sm
    marginTop: 8, // mt-2
    textAlign: 'center',
  },
  questionCounter: {
    color: '#4b5563', // text-gray-600
    fontSize: 14, // text-sm
    marginBottom: 24, // mb-6
    textAlign: 'center',
  },
  questionSection: {
    marginBottom: 24, // mb-6
  },
  questionText: {
    fontSize: 18, // text-lg
    fontWeight: '600', // font-semibold
    color: '#111827', // text-gray-900
    marginBottom: 16, // mb-4
  },
  optionsContainer: {
    gap: 12, // space-y-3
  },
  optionButton: {
    width: '100%',
    textAlign: 'left',
    padding: 12, // p-3
    borderRadius: 8, // rounded-lg
    borderWidth: 2,
    borderColor: '#e5e7eb', // border-gray-200
    backgroundColor: '#f9fafb', // bg-gray-50
  },
  optionButtonText: {
    color: '#1f2937', // text-gray-800
  },
  selectedOption: {
    backgroundColor: '#e0e7ff', // bg-indigo-100
    borderColor: '#6366f1', // border-indigo-500
  },
  correctOption: {
    backgroundColor: '#dcfce7', // bg-green-100
    borderColor: '#22c55e', // border-green-500
  },
  incorrectOption: {
    backgroundColor: '#fee2e2', // bg-red-100
    borderColor: '#ef4444', // border-red-500
  },
  checkAnswerButton: {
    width: '100%',
    backgroundColor: '#4f46e5', // bg-indigo-600
    paddingVertical: 12, // py-3
    borderRadius: 8, // rounded-lg
    fontWeight: '600', // font-semibold
    shadowColor: '#000', // shadow-md
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4, // Para Android
    alignItems: 'center',
  },
  checkAnswerButtonText: {
    color: '#ffffff', // text-white
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
  resultSection: {
    marginTop: 24, // mt-6
    alignItems: 'center',
  },
  quizMessage: {
    fontWeight: 'bold',
    fontSize: 20, // text-xl
    marginBottom: 16, // mb-4
    textAlign: 'center',
  },
  successMessage: {
    color: '#16a34a', // text-green-600
  },
  nextQuestionButton: {
    width: '100%',
    backgroundColor: '#4f46e5', // bg-indigo-600
    paddingVertical: 12, // py-3
    borderRadius: 8, // rounded-lg
    fontWeight: '600', // font-semibold
    shadowColor: '#000', // shadow-md
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4, // Para Android
    alignItems: 'center',
  },
  nextQuestionButtonText: {
    color: '#ffffff', // text-white
    fontWeight: '600',
  },
  noQuizText: {
    color: '#6b7280', // text-gray-500
    textAlign: 'center',
    marginTop: 16, // mt-4
  },
});
