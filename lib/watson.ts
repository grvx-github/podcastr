import TextToSpeechV1 from "ibm-watson/text-to-speech/v1"
import { IamAuthenticator } from "ibm-watson/auth"

// Initialize IBM Watson Text-to-Speech client
const textToSpeech = new TextToSpeechV1({
  authenticator: new IamAuthenticator({
    apikey: process.env.WATSON_API_KEY as string,
  }),
  serviceUrl: process.env.WATSON_SERVICE_URL as string,
})

export default textToSpeech
