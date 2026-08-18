import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

// Exemple concret : { pseudo: "Awa", contenu: "Salut Kofi !", dateEnvoi: ... }
@Schema()
export class Message {
  @Prop({ required: true })
  pseudo: string;

  @Prop({ required: true })
  contenu: string;

  @Prop({ default: Date.now })
  dateEnvoi: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);