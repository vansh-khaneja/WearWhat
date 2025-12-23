'use client';

interface AccountSettingsProps {
  userName: string;
  userEmail: string;
  onLogout: () => void;
}

export default function AccountSettings({
  userName,
  userEmail,
  onLogout
}: AccountSettingsProps) {
  return (
    <div className="bg-white rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
      <div className="space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-2xl font-semibold text-gray-700">
              {(userName || userEmail).charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">
              {userName || userEmail || 'User Account'}
            </p>
            <p className="text-sm text-gray-600">{userEmail || 'No email'}</p>
            <p className="text-sm text-gray-500 mt-1">Member since {new Date().toLocaleDateString()}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={userEmail}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>
          <button
            onClick={onLogout}
            className="w-full bg-red-50 hover:bg-red-100 text-red-700 px-6 py-3 rounded-lg font-semibold border border-red-200 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

