import { supabase } from '../config/supabaseClient.js';
import { authService } from './authService.js';

export const profileService = {
    // Buscar o perfil completo de saúde do usuário atual
    async getProfile() {
        try {
            console.group("🔍 [profileService] Buscando Perfil...");
            const { session, error: sessionError } = await authService.getUserSession();
            
            if (!session) {
                console.warn("⚠️ Usuário não está logado.");
                console.groupEnd();
                return { profile: null, error: "Não logado" };
            }

            const userId = session.user.id;
            console.log("Buscando dados para o UserID:", userId);

            const { data, error } = await supabase
                .from('dados_saude')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            console.log("Sucesso! Dados recebidos:", data || "Nenhum perfil encontrado.");
            console.groupEnd();
            return { profile: data, error: null };
        } catch (error) {
            console.error("❌ Erro no getProfile:", error.message);
            console.groupEnd();
            return { profile: null, error };
        }
    },

    // Salva (cria ou atualiza) os dados através da função upsert
    async saveProfile(profileData) {
        try {
            console.group("💾 [profileService] Salvando Perfil...");
            const { session, error: sessionError } = await authService.getUserSession();
            if (!session) throw new Error("Acesso negado: Usuário não está logado");

            const userId = session.user.id;

            const updates = {
                user_id: userId,
                idade: typeof profileData.idade === 'number' ? profileData.idade : null,
                peso: typeof profileData.peso === 'number' ? profileData.peso : null,
                altura: typeof profileData.altura === 'number' ? profileData.altura : null,
                sexo: profileData.sexo || null,
                fuma: Boolean(profileData.fuma),
                bebe: Boolean(profileData.bebe),
                alergia_medicamento: profileData.alergia_medicamento ? true : false,
                possui_deficiencia: profileData.possui_deficiencia ? [profileData.possui_deficiencia] : [],
                contato_medico_particular: profileData.contato_medico_particular || '',
            };

            console.log("Enviando dados para o Supabase:", updates);

            const { data, error } = await supabase
                .from('dados_saude')
                .upsert(updates, { onConflict: 'user_id' })
                .select()
                .single();

            if (error) throw error;
            
            console.log("✅ Perfil salvo com sucesso!", data);
            console.groupEnd();
            return { profile: data, error: null };
        } catch (error) {
            console.error("❌ Erro no saveProfile:", error.message);
            console.groupEnd();
            return { profile: null, error };
        }
    }
};
