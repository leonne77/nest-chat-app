import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

// cors: '*' permet à notre page HTML de se connecter depuis le navigateur
@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  // Appelé automatiquement quand un client se connecte (ouvre la page)
  async handleConnection(client: Socket) {
    console.log(`Client connecté : ${client.id}`);

    // On envoie l'historique des messages uniquement à ce nouveau client
    const historique = await this.chatService.recupererHistorique();
    client.emit('historique', historique);
  }

  // Appelé automatiquement quand un client se déconnecte
  handleDisconnect(client: Socket) {
    console.log(`Client déconnecté : ${client.id}`);
  }

  // Écoute l'événement "message" envoyé par un client
  // Exemple reçu : { pseudo: "Kofi", contenu: "Ça va bien, et toi ?" }
  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: { pseudo: string; contenu: string },
  ) {
    // 1. On sauvegarde le message en base MongoDB
    const messageSauvegarde = await this.chatService.creerMessage(
      data.pseudo,
      data.contenu,
    );

    // 2. On renvoie le message à TOUS les clients connectés (broadcast)
    this.server.emit('message', messageSauvegarde);
  }
}