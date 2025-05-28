import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

async function getUsers() {
    const { data, error } = await supabase.from('users').select('*')
    if (error) console.error(error)
    else console.log(data)
}

getUsers()
