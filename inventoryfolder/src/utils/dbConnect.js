import {Client, pool} from "pg";
export const pool = new pool({
    connectionString: process.env.POSTGRES_URL,
})

export default async function dbConnect (){
    await pool.connect((err,client, release)=>{
        if (err){
            return console.err("Error in Connection", err.stack)
        }

        client.query("SELECT now()", (err,result)=>{
            release()
            if(err){
                return console.error("Error in query execution", err.stack)
            }
        })
    })
}