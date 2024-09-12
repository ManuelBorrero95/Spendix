```markdown
# Spendix: Gestisci le Tue Spese con Stile 💸

Benvenuto nel repository di Spendix, l'app che rende il tracciamento delle spese un gioco da ragazzi!

📱 **Versione Live**: [https://spendix.vercel.app/](https://spendix.vercel.app/)

## 📊 Cos'è Spendix?

Spendix è un'applicazione intuitiva per la gestione delle spese personali. Ti aiuta a tenere traccia delle tue finanze in modo semplice e divertente.

## 🌟 Caratteristiche Principali

- Tracciamento facile delle spese quotidiane
- Categorizzazione automatica delle transazioni
- Grafici interattivi per visualizzare le tue abitudini di spesa
- Impostazione di budget e obiettivi di risparmio
- Sincronizzazione multidevice per accedere ai tuoi dati ovunque

## 🚀 Come Iniziare

1. Clona il repository
2. Installa le dipendenze
3. Configura il tuo ambiente
4. Lancia l'app e inizia a tracciare!

```bash
git clone https://github.com/tuousername/spendix.git
cd spendix
npm install
npm start
```

## 🛠 Debug del Progetto

Segui questi passaggi per configurare e debuggare il progetto:

1. Clonare il repository:
   ```
   git clone https://github.com/tuoUsername/spendix.git
   cd spendix
   ```

2. Installare le dipendenze del backend:
   ```
   cd backend
   npm install
   ```

3. Configurare le variabili d'ambiente del backend:
   - Crea un file `.env` nella cartella `backend`
   - Aggiungi le variabili necessarie come MONGODB_URI, JWT_SECRET, ecc.

4. Avviare il server backend in modalità di debug:
   ```
   node --inspect server.js
   ```

5. Installare le dipendenze del frontend:
   ```
   cd ../frontend
   npm install
   ```

6. Configurare le variabili d'ambiente del frontend:
   - Crea un file `.env` nella cartella `frontend`
   - Aggiungi la variabile VITE_API_URL con l'URL del tuo backend

7. Avviare il server di sviluppo del frontend:
   ```
   npm run dev
   ```

8. Aprire il browser e navigare su `http://localhost:5173` (o la porta indicata dal server Vite)

9. Per il debug del frontend:
   - Apri gli strumenti di sviluppo del browser (F12)
   - Vai alla scheda "Sources" e aggiungi i breakpoint necessari

10. Per il debug del backend:
    - Apri Chrome e vai su `chrome://inspect`
    - Clicca su "Open dedicated DevTools for Node"
    - Aggiungi i breakpoint necessari nel codice del backend

11. Utilizza l'applicazione e verifica il flusso attraverso i breakpoint impostati

12. Per il debug delle chiamate API:
    - Utilizza la scheda "Network" negli strumenti di sviluppo del browser
    - Filtra per "XHR" per vedere solo le chiamate AJAX

13. Per il debug del database:
    - Usa uno strumento come MongoDB Compass per connetterti al tuo database
    - Ispeziona le collezioni e i documenti per verificare che i dati siano corretti

14. Per il debug dei problemi di stile:
    - Usa l'inspector degli elementi del browser per verificare le classi Tailwind applicate
    - Modifica gli stili in tempo reale per testare le modifiche

## 🤝 Vuoi Contribuire?

Fantastico! Siamo sempre alla ricerca di nuove idee. Ecco come puoi aiutare:

1. Fai un fork del progetto
2. Crea il tuo branch delle feature (`git checkout -b feature/AmazingFeature`)
3. Commit delle tue modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 🐛 Hai Trovato un Bug?

Se incontri problemi, apri un issue descrivendo:

- Il comportamento atteso
- Cosa è successo invece
- Passi per riprodurre il problema

## 📜 Licenza

Questo progetto è sotto la licenza MIT. Vedi il file LICENSE per maggiori dettagli.

Ricorda: gestire le proprie finanze può essere divertente! Con Spendix, ogni centesimo conta. 💰✨
