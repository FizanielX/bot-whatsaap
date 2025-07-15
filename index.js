import makeWASocket, { useSingleFileAuthState } from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import fs from 'fs'

const { state, saveState } = useSingleFileAuthState('./session.json')

async function start() {
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
  })

  sock.ev.on('creds.update', saveState)

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message || msg.key.fromMe) return

    const chat = msg.message.conversation || msg.message.extendedTextMessage?.text

    if (chat === 'ping') {
      await sock.sendMessage(msg.key.remoteJid, { text: 'pong 🏓' }, { quoted: msg })
    }
  })
}

start()