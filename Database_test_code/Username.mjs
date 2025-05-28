import { createClient } from '@supabase/supabase-js'
import readline from 'readline'
import 'dotenv/config'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve))
}

async function addUniqueGebruikersnaam() {
    while (true) {
        const gebruikersnaam = await askQuestion('Voer een gebruikersnaam in: ')

        // Check if the username exists
        const { data: existing, error: checkError } = await supabase
            .from('users')
            .select('Gebruikersnaam')
            .eq('Gebruikersnaam', gebruikersnaam)
            .limit(1)

        if (checkError) {
            console.error('❌ Fout bij controleren:', checkError.message)
            break
        }

        if (existing.length > 0) {
            console.log(`⚠️ Gebruikersnaam "${gebruikersnaam}" bestaat al. Probeer opnieuw.\n`)
            continue
        }

        // Insert new user
        const { data, error } = await supabase
            .from('users')
            .insert([{ Gebruikersnaam: gebruikersnaam }])

        if (error) {
            console.error('❌ Fout bij toevoegen:', error.message)
        } else {
            console.log(`✅ Gebruikersnaam "${gebruikersnaam}" is toegevoegd!`)
            break
        }
    }

    rl.close()
}

addUniqueGebruikersnaam()
