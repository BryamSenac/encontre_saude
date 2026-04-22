import { supabase } from '../config/supabaseClient.js';
import { authService } from './authService.js';

export const chatService = {
    // Salva uma nova interação no banco de dados
    async saveInteraction(userDescription, aiResponse) {
        try {
            const { session, error: sessionError } = await authService.getUserSession();
            if (sessionError) throw sessionError;
            if (!session) return { data: null, error: "Usuário não logado" };

            const { data, error } = await supabase
                .from('historico_ia')
                .insert([
                    {
                        user_id: session.user.id,
                        descricao_usuario: userDescription,
                        resposta_ia: aiResponse
                    }
                ])
                .select()
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error("Erro ao salvar histórico IA:", error.message);
            return { data: null, error };
        }
    },

    // Busca o histórico completo do usuário logado
    async getUserHistory() {
        try {
            const { session, error: sessionError } = await authService.getUserSession();
            if (sessionError) throw sessionError;
            if (!session) return { history: [], error: "Usuário não logado" };

            const { data, error } = await supabase
                .from('historico_ia')
                .select('*')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return { history: data, error: null };
        } catch (error) {
            console.error("Erro ao buscar histórico IA:", error.message);
            return { history: [], error };
        }
    }
};
