/**
 * Simple manual test for RestartButton functionality
 * This file can be used to manually verify the restart functionality
 * without requiring a full test framework setup
 */

import { RestartButton, StoryRestartButton, QuickRestartButton } from './RestartButton';

// Test component that demonstrates all RestartButton variants
export function RestartButtonDemo() {
  const handleRestart = () => {
    console.log('Restart callback triggered');
    alert('Restart functionality working!');
  };

  return (
    <div className="p-8 space-y-6 bg-slate-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-8">RestartButton Component Demo</h1>
      
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-amber-400">Primary Variant</h2>
        <RestartButton
          onRestart={handleRestart}
          variant="primary"
          size="md"
        />
      </div>
      
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-amber-400">Secondary Variant</h2>
        <RestartButton
          onRestart={handleRestart}
          variant="secondary"
          size="md"
        />
      </div>
      
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-amber-400">Danger Variant</h2>
        <RestartButton
          onRestart={handleRestart}
          variant="danger"
          size="md"
        />
      </div>
      
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-amber-400">Different Sizes</h2>
        <div className="flex gap-4 items-center">
          <RestartButton
            onRestart={handleRestart}
            variant="primary"
            size="sm"
          />
          <RestartButton
            onRestart={handleRestart}
            variant="primary"
            size="md"
          />
          <RestartButton
            onRestart={handleRestart}
            variant="primary"
            size="lg"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-amber-400">Story Restart Button</h2>
        <StoryRestartButton onRestart={handleRestart} />
      </div>
      
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-amber-400">Quick Restart (No Confirmation)</h2>
        <QuickRestartButton onRestart={handleRestart} />
      </div>
      
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-amber-400">Disabled State</h2>
        <RestartButton
          onRestart={handleRestart}
          variant="primary"
          size="md"
          disabled={true}
        />
      </div>
      
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-amber-400">Without Confirmation</h2>
        <RestartButton
          onRestart={handleRestart}
          variant="primary"
          size="md"
          showConfirmation={false}
        />
      </div>
      
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-amber-400">Custom Messages</h2>
        <RestartButton
          onRestart={handleRestart}
          variant="primary"
          size="md"
          confirmationTitle="Custom Title"
          confirmationMessage="This is a custom confirmation message for testing purposes."
        />
      </div>
    </div>
  );
}

// Manual test functions that can be called from browser console
export const manualTests = {
  // Test store reset functionality
  testStoreReset: () => {
    console.log('Testing store reset...');
    
    // Import stores dynamically to avoid SSR issues
    import('@/stores').then(({ resetAllStores, performCompleteReset }) => {
      console.log('Before reset - checking stores...');
      
      // Reset all stores
      resetAllStores();
      console.log('Stores reset completed');
      
      // Test complete reset
      performCompleteReset().then((success) => {
        console.log('Complete reset result:', success);
      });
    });
  },
  
  // Test session storage functionality
  testSessionStorage: () => {
    console.log('Testing session storage...');
    
    import('@/stores').then(({ sessionStorageUtils }) => {
      // Save test data
      sessionStorage.setItem('test-data', 'test-value');
      console.log('Test data saved to session storage');
      
      // Clear session
      const cleared = sessionStorageUtils.clearSession();
      console.log('Session cleared:', cleared);
      
      // Check if test data still exists
      const testData = sessionStorage.getItem('test-data');
      console.log('Test data after clear:', testData);
    });
  },
  
  // Test localStorage cleanup
  testLocalStorageCleanup: () => {
    console.log('Testing localStorage cleanup...');
    
    // Add test data
    localStorage.setItem('quiz-store-test', 'test-value');
    localStorage.setItem('player-store-test', 'test-value');
    localStorage.setItem('story-store-test', 'test-value');
    localStorage.setItem('ui-store-test', 'test-value');
    localStorage.setItem('fantasy-quiz-test', 'test-value');
    localStorage.setItem('unrelated-data', 'should-remain');
    
    console.log('Test data added to localStorage');
    
    import('@/stores').then(({ performCompleteReset }) => {
      performCompleteReset().then(() => {
        console.log('Complete reset performed');
        
        // Check what remains
        const remaining = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            remaining.push(key);
          }
        }
        
        console.log('Remaining localStorage keys:', remaining);
        console.log('Unrelated data should remain:', localStorage.getItem('unrelated-data'));
      });
    });
  }
};

// Make tests available globally for browser console testing
if (typeof window !== 'undefined') {
  (window as any).restartButtonTests = manualTests;
}