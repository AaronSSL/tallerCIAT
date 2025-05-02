
const SUPABASE_URL = "https://hadrdwcgboyqbpoqyyhg.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhZHJkd2NnYm95cWJwb3F5eWhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwNjE0MzEsImV4cCI6MjA2MTYzNzQzMX0.xkey8tSmffYh_jdcbhT9Og1ic2XStnn7HErDFyk-_30"
    
      // Inicializar Supabase correctamente
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
