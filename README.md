# MissComms
Entry into Hack Western 12.  A 32 hour hackathon located in London, Ontario.  


## Table Of Contents
- <a href="#How To Run">How To Run </a>
- <a href="#Building From Source"> Building From Source </a>
- <a href="#Project Structure"> Project Structure</a>

## How To Run
```
# Front end
cd miscommunication
npm run dev

# Back end
cd server
flask run
```

## Building From Source
```
git clone https://github.com/DexterLuth/Miscommunication.git
# or by ssh
git clone git@github.com:DexterLuth/Miscommunication.git

# Front end
cd Miscommunication/miscommunication
npm install
```

## Project Structure
```
├── miscommunication/    # Backend
|   └──src/
|       ├── components/
|       |   ├── Stats.jsx                 # Agent statistics
|       |   ├── TranscriptTable.jsx       # Table showcasing the transcripts
|       |   └── uploadFile.jsx            # Upload the file
|       ├── main.jsx            # Main page
|       ├── App.jsx             # Home page
|       └── supabaseClient.js   # Supabase pipeline
├── server/              # Front end
|   ├── app.py            # API Endpoint
|   └── main.py           # Multilayer AI
└── README.md
  
```
