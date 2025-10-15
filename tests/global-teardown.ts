async function globalTeardown() {
  console.log('🧹 Global Teardown: Nettoyage environnement de test')
  
  // Nettoyer les données de test
  // Fermer les connexions
  // Arrêter les services si lancés par les tests
  
  console.log('✅ Global Teardown terminé')
}

export default globalTeardown
