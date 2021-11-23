import { Service } from 'typedi';
import SessionHandler from '../../../Services/SessionDb/SessionHandler';
import Messages from '../../Interfaces/Messages';

@Service()
export default class BotStartup {
  constructor(private readonly SessionHandler : SessionHandler) {}

  public Start(bot: any) {
    bot.onMessage((message: Messages) => {
      
      this.SessionHandler.CheckIn(message.from);


      if (message.body === 'Hi' && message.isGroupMsg === false) {
        console.log(message);
  
        bot
          .sendText(message.from, 'Welcome Venom 🕷')
          .then((result : any) => {
            // const test = SessionRepository.GetClientCurrentStep();
  
            // console.log({ test });
  
            // console.log('Result: ', result); // return object success
          })
          .catch((erro : any) => {
            console.error('Error when sending: ', erro); // return object error
          });
      }
    });
  }
}



