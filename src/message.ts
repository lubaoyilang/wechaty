/**
 *   Wechaty - https://github.com/chatie/wechaty
 *
 *   @copyright 2016-2018 Huan LI <zixia@zixia.net>
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *   @ignore
 */

import {
  MsgType,
  AppMsgType,
}                       from './puppet-web/schema'

import {
  Sayable,
  log,
}                       from './config'

import Contact          from './contact'
import Room             from './room'
import PuppetAccessory  from './puppet-accessory'

// circuliar dependencies?
import MediaMessage     from './message-media'

// export type TypeName =  'attachment'
//                       | 'audio'
//                       | 'image'
//                       | 'video'

/**
 * All wechat messages will be encapsulated as a Message.
 *
 * `Message` is `Sayable`,
 * [Examples/Ding-Dong-Bot]{@link https://github.com/Chatie/wechaty/blob/master/examples/ding-dong-bot.ts}
 */
export abstract class Message extends PuppetAccessory implements Sayable {
  /**
   * @private
   */
  constructor(
    readonly objOrId: Object | string,
  ) {
    super()
    log.silly('Message', 'constructor()')
  }

  /**
   * @private
   */
  public toString() {
    return `Message`
  }

  public abstract async say(text: string, replyTo?: Contact | Contact[])              : Promise<void>
  public abstract async say(mediaMessage: MediaMessage, replyTo?: Contact | Contact[]): Promise<void>

  /**
   * Reply a Text or Media File message to the sender.
   *
   * @see {@link https://github.com/Chatie/wechaty/blob/master/examples/ding-dong-bot.ts|Examples/ding-dong-bot}
   * @param {(string | MediaMessage)} textOrMedia
   * @param {(Contact|Contact[])} [replyTo]
   * @returns {Promise<any>}
   *
   * @example
   * const bot = new Wechaty()
   * bot
   * .on('message', async m => {
   *   if (/^ding$/i.test(m.content())) {
   *     await m.say('hello world')
   *     console.log('Bot REPLY: hello world')
   *     await m.say(new MediaMessage(__dirname + '/wechaty.png'))
   *     console.log('Bot REPLY: Image')
   *   }
   * })
   */
  public abstract async say(textOrMedia: string | MediaMessage, replyTo?: Contact|Contact[]): Promise<void>

  /**
   * @private
   */
  public abstract from(contact: Contact): void
  /**
   * @private
   */
  public abstract from(id: string): void
  public abstract from(): Contact
  /**
   * Get the sender from a message.
   * @returns {Contact}
   */
  public abstract from(contact?: Contact|string): Contact|void

  /**
   * @private
   */
  public abstract room(room: Room): void
  /**
   * @private
   */
  public abstract room(id: string): void
  public abstract room(): Room | null
  /**
   * Get the room from the message.
   * If the message is not in a room, then will return `null`
   *
   * @returns {(Room | null)}
   */
  public abstract room(room?: Room | string): Room | null | void

  /**
   * Get the content of the message
   *
   * @returns {string}
   */
  public abstract content(): string
  /**
   * @private
   */
  public abstract content(content: string): void
  /**
   * Get the content of the message
   *
   * @returns {string}
   */
  public abstract content(content?: string): string | void

  /**
   * Get the type from the message.
   *
   * If type is equal to `MsgType.RECALLED`, {@link Message#id} is the msgId of the recalled message.
   * @see {@link MsgType}
   * @returns {MsgType}
   */
  public abstract type(): MsgType

  /**
   * Get the typeSub from the message.
   *
   * If message is a location message: `m.type() === MsgType.TEXT && m.typeSub() === MsgType.LOCATION`
   *
   * @see {@link MsgType}
   * @returns {MsgType}
   */
  public abstract typeSub(): MsgType

  /**
   * Get the typeApp from the message.
   *
   * @returns {AppMsgType}
   * @see {@link AppMsgType}
   */
  public abstract typeApp(): AppMsgType

  /**
   * Check if a message is sent by self.
   *
   * @returns {boolean} - Return `true` for send from self, `false` for send from others.
   * @example
   * if (message.self()) {
   *  console.log('this message is sent by myself!')
   * }
   */
  public abstract self(): boolean

  /**
   *
   * Get message mentioned contactList.
   *
   * Message event table as follows
   *
   * |                                                                            | Web  |  Mac PC Client | iOS Mobile |  android Mobile |
   * | :---                                                                       | :--: |     :----:     |   :---:    |     :---:       |
   * | [You were mentioned] tip ([有人@我]的提示)                                   |  ✘   |        √       |     √      |       √         |
   * | Identify magic code (8197) by copy & paste in mobile                       |  ✘   |        √       |     √      |       ✘         |
   * | Identify magic code (8197) by programming                                  |  ✘   |        ✘       |     ✘      |       ✘         |
   * | Identify two contacts with the same roomAlias by [You were  mentioned] tip |  ✘   |        ✘       |     √      |       √         |
   *
   * @returns {Contact[]} - Return message mentioned contactList
   *
   * @example
   * const contactList = message.mentioned()
   * console.log(contactList)
   */
  public abstract mentioned(): Contact[]

  /**
   * @private
   */
  public abstract async ready(): Promise<this>

  /**
   * @todo add function
   */
  public static async find(query) {
    return this.findAll(query)[0]
  }

  /**
   * @todo add function
   */
  public static async findAll(query) {
    return Promise.resolve([
      new (this as any)(1),
      new (this as any)(2),
    ])
  }

  /**
   * @private
   */
  public abstract to(contact: Contact): void
  /**
   * @private
   */
  public abstract to(id: string): void
  public abstract to(): Contact | null // if to is not set, then room must had set
  /**
   * Get the destination of the message
   * Message.to() will return null if a message is in a room, use Message.room() to get the room.
   * @returns {(Contact|null)}
   */
  public abstract to(contact?: Contact | string): Contact | Room | null | void

}

export default Message
