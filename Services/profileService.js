import { supabase } from '../config/supabaseClient.js';
import { authService } from './authService.js';

export const profileService = {
    // Buscar o perfil completo de saúde do usuário atual
    async getProfile() {
        try {
            const { session, error: sessionError } = await authService.getUserSession();
            if (sessionError) throw sessionError;
            if (!session) throw new Error("Acesso negado: Usuário não está logado");

            const userId = session.user.id;

            // Busca na tabela 'dados_saude' usando 'user_id'
            const { data, error } = await supabase
                .from('dados_saude')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error && error.code !== 'PGRST116') {
                throw error;
            }

            return { profile: data, error: null };
        } catch (error) {
            console.error("Erro no getProfile:", error.message);
            return { profile: null, error };
        }
    },

    // Salva (cria ou atualiza) os dados através da função upsert
    async saveProfile(profileData) {
        try {
            const { session, error: sessionError } = await authService.getUserSession();
            if (sessionError) throw sessionError;
            if (!session) throw new Error("Acesso negado: Usuário não está logado");

            const userId = session.user.id;

            // Mapeamento exato para as colunas do banco (conforme imagem)
            const updates = {
                user_id: userId,
                idade: typeof profileData.idade === 'number' ? profileData.idade : null,
                peso: typeof profileData.peso === 'number' ? profileData.peso : null,
                altura: typeof profileData.altura === 'number' ? profileData.altura : null,
                sexo: profileData.sexo || null,
                fuma: Boolean(profileData.fuma),
                bebe: Boolean(profileData.bebe),
                // O banco espera Bool para alergia_medicamento
                alergia_medicamento: profileData.alergia_medicamento ? true : false,
                // O banco espera _text (array) para possui_deficiencia
                possui_deficiencia: profileData.possui_deficiencia ? [profileData.possui_deficiencia] : [],
                contato_medico_particular: profileData.contato_medico_particular || '',
            };

            const { data, error } = await supabase
                .from('dados_saude')
                .upsert(updates, { onConflict: 'user_id' }) // Usa user_id para decidir se faz Update ou Insert
                .select()
                .single();

            if (error) throw error;
            return { profile: data, error: null };
        } catch (error) {
            console.error("Erro no saveProfile:", error.message);
            return { profile: null, error };
        }
    }
};
