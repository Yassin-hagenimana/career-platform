"use server"

import { createClientServer } from "@/lib/supabase"
import fs from "fs"
import path from "path"

export async function setupProfileTable() {
  const supabase = createClientServer()

  try {
    // Read the SQL file
    const sqlFilePath = path.join(process.cwd(), "app/actions/create-profile-table.sql")
    const sqlQuery = fs.readFileSync(sqlFilePath, "utf8")

    // Execute the SQL query
    const { error } = await supabase.rpc("exec_sql", { sql_query: sqlQuery })

    if (error) throw error

    return { success: true, message: "Profile table setup completed successfully" }
  } catch (error) {
    console.error("Error setting up profile table:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to setup profile table",
    }
  }
}

