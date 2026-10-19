
"use client";

// React hooks for component state and side effects
import { useState, useEffect } from "react";

// Firebase Authentication function to update the user's profile
import { updateProfile } from "firebase/auth";

// Custom authentication context
import { useAuth } from "@/context/AuthContext";

// Next.js navigation
import { useRouter } from "next/navigation";

// Toast notifications for success and error messages
import { toast } from "react-hot-toast";

// Next.js optimized image component
import Image from "next/image";

// Icons for the profile and logout button
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";

// Displays the user's profile information and update form
function ProfileContent({ user, logout, refreshUser }) {
  const router = useRouter();

  // Store the editable name and the name displayed in the profile
  const [name, setName] = useState(user.displayName || "");
  const [displayName, setDisplayName] = useState(
    user.displayName || ""
  );

  // Track profile update and logout loading states
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  // Validate and update the user's display name
  const handleUpdate = async (e) => {
    e.preventDefault();

    // Remove unnecessary spaces from the entered name
    const newName = name.trim();

    // Ensure the name contains at least two characters
    if (newName.length < 2) {
      toast.error("নাম কমপক্ষে ২ অক্ষরের হতে হবে");
      return;
    }

    // Prevent unnecessary updates when the name has not changed
    if (newName === (user.displayName || "")) {
      toast.error("নামে কোনো পরিবর্তন করা হয়নি");
      return;
    }

    setSaving(true);

    try {
      // Update the display name in Firebase Authentication
      await updateProfile(user, {
        displayName: newName,
      });

      // Refresh the authentication context with updated user information
      await refreshUser();

      // Synchronize the input field and displayed profile name
      setDisplayName(newName);
      setName(newName);

      // Notify the user that the update was successful
      toast.success("প্রোফাইল আপডেট হয়েছে");
    } catch (error) {
      // Log the error and notify the user if the update fails
      console.error("Profile update error:", error);
      toast.error("প্রোফাইল আপডেট করা যায়নি");
    } finally {
      // Stop the loading state whether the update succeeds or fails
      setSaving(false);
    }
  };

  // Sign out the user and redirect to the home page
  const handleLogout = async () => {
    setSigningOut(true);

    try {
      // Execute the logout function from the authentication context
      await logout();

      // Show a success notification and return to the home page
      toast.success("সফলভাবে সাইন আউট হয়েছে");
      router.replace("/");
    } catch (error) {
      // Handle logout errors
      console.error("Logout error:", error);
      toast.error("সাইন আউট করা যায়নি");
      setSigningOut(false);
    }
  };

  return (
    // Main profile page with a light green background
    <main className="flex-1 bg-[#f0f7f2] px-4 pt-12 pb-24">
      <div className="max-w-[600px] mx-auto">

        {/* Page title and introductory description */}
        <div className="text-left mb-6">
          <h1 className="text-2xl font-bold text-[#1e3024]">
            আমার প্রোফাইল
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
          </p>
        </div>

        {/* Profile information card: photo, name, email, and logout */}
        <div className="bg-white border border-[#dfe8e1] rounded-xl p-5 mb-5">
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">

            {/* Display the user's photo or a default profile icon */}
            <div className="shrink-0">
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt="Profile picture"
                  width={64}
                  height={64}
                  unoptimized
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-xl object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center">
                  <FaUserCircle className="text-gray-400 text-4xl" />
                </div>
              )}
            </div>

            {/* Display the current name and email address */}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-[#253329]">
                {displayName || "ব্যবহারকারী"}
              </h2>

              <p className="text-sm text-gray-500 break-all mt-0.5">
                {user.email}
              </p>
            </div>

            {/* Logout button with a loading state */}
            <button
              type="button"
              onClick={handleLogout}
              disabled={signingOut}
              className="flex items-center justify-center gap-2 border border-red-400 text-red-500 rounded-lg px-4 py-2 text-sm font-medium hover:bg-red-50 transition cursor-pointer disabled:opacity-60"
            >
              <FaSignOutAlt />
              {signingOut ? "অপেক্ষা করুন..." : "সাইন আউট"}
            </button>

          </div>
        </div>

        {/* Profile update card */}
        <div className="bg-white border border-[#dfe8e1] rounded-xl p-5 sm:p-7">
          <h3 className="text-lg font-bold text-[#253329] mb-8">
            তথ্য আপডেট
          </h3>

          {/* Form for updating the user's display name */}
          <form onSubmit={handleUpdate} className="px-0 sm:px-3">

            <label
              htmlFor="profile-name"
              className="block text-sm font-medium text-gray-800 mb-2"
            >
              নাম
            </label>

            {/* Controlled input connected to the name state */}
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="আপনার নাম লিখুন"
              minLength={2}
              required
              disabled={saving}
              className="w-full border border-[#dce7df] bg-[#fcfefd] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-600 disabled:opacity-60"
            />

            {/* Submit button for saving profile changes */}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#008c45] hover:bg-[#00783b] text-white py-2.5 rounded-lg mt-3 font-medium shadow-sm transition cursor-pointer disabled:opacity-60"
            >
              {saving ? "আপডেট হচ্ছে..." : "আপডেট ইনফরমেশন"}
            </button>

          </form>
        </div>

      </div>
    </main>
  );
}

// Main profile page: checks authentication before displaying profile content
export default function ProfilePage() {
  // Get the authenticated user, loading status, logout, and refresh functions
  const { user, loading, logout, refreshUser } = useAuth();
  const router = useRouter();

  // Redirect unauthenticated users to the sign-in page
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/signin");
    }
  }, [user, loading, router]);

  // Show a loading message while authentication is being checked
  // or while an unauthenticated user is being redirected
  if (loading || !user) {
    return (
      <main className="flex-1 bg-[#f0f7f2] flex items-center justify-center py-20">
        <p className="text-gray-500">লোড হচ্ছে...</p>
      </main>
    );
  }

  // Render the profile only after confirming the user is authenticated
  return (
    <ProfileContent
      key={user.uid}
      user={user}
      logout={logout}
      refreshUser={refreshUser}
    />
  );
}
