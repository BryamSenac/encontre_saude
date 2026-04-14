import { supabase } from '../config/supabaseClient.js';

export const authService = {
    // Cadastro de novo usuário
    async signUp(email, password) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
            });
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error("Erro no signUp:", error.message);
            return { data: null, error };
        }
    },

    // Login com usuário existente
    async signIn(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error("Erro no signIn:", error.message);
            return { data: null, error };
        }
    },

    // Desconectar o usuário atual
    async signOut() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            return { error: null };
        } catch (error) {
            console.error("Erro no signOut:", error.message);
            return { error };
        }
    },

    // Obter sessão atual do usuário (Verificar quem está logado ao carregar a página)
    async getUserSession() {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) throw error;
            return { session, error: null };
        } catch (error) {
            console.error("Erro obtendo sessão:", error.message);
            return { session: null, error };
        }
    },
    // Login com Google (OAuth)
    async signInWithGoogle() {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + '/index.html'
                }
            });
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error("Erro no login Google:", error.message);
            return { data: null, error };
        }
    }
};
