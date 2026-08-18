import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './message.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  // Sauvegarde un nouveau message en base
  async creerMessage(pseudo: string, contenu: string): Promise<Message> {
    const message = new this.messageModel({ pseudo, contenu });
    return message.save();
  }

  // Récupère les 50 derniers messages, du plus ancien au plus récent
  async recupererHistorique(): Promise<Message[]> {
    return this.messageModel
      .find()
      .sort({ dateEnvoi: -1 })
      .limit(50)
      .then((messages) => messages.reverse());
  }
}