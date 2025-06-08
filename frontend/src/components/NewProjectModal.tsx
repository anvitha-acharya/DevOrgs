import type React from 'react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Plus, Trash2, Calendar, Mail } from 'lucide-react';

interface NewProjectModalProps {
  onClose: () => void;
  onSubmit: (projectData: {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    invitedEmails: string[];
  }) => void;
}

export function NewProjectModal({ onClose, onSubmit }: NewProjectModalProps) {
  const { state } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
  });
  const [invitedEmails, setInvitedEmails] = useState<string[]>(['']);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    // Validate emails
    const validEmails = invitedEmails.filter(email => email.trim());
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = validEmails.filter(email => !emailRegex.test(email));

    if (invalidEmails.length > 0) {
      newErrors.emails = 'Please enter valid email addresses';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const validEmails = invitedEmails.filter(email => email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));

      onSubmit({
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        invitedEmails: validEmails,
      });
    }
  };

  const addEmailField = () => {
    setInvitedEmails([...invitedEmails, '']);
  };

  const removeEmailField = (index: number) => {
    setInvitedEmails(invitedEmails.filter((_, i) => i !== index));
  };

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...invitedEmails];
    newEmails[index] = value;
    setInvitedEmails(newEmails);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-xl shadow-xl transition-colors duration-300 ${
        state.darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className={`text-xl font-semibold ${
            state.darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Create New Project
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              state.darkMode
                ? 'hover:bg-gray-700 text-gray-400'
                : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Project Title */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              state.darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Project Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                state.darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900'
              } ${errors.title ? 'border-red-500' : ''}`}
              placeholder="Enter project title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              state.darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                state.darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="Enter project description"
              rows={3}
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                state.darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <Calendar className="h-4 w-4 inline mr-1" />
                Start Date *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                  state.darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } ${errors.startDate ? 'border-red-500' : ''}`}
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                state.darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <Calendar className="h-4 w-4 inline mr-1" />
                End Date *
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                  state.darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } ${errors.endDate ? 'border-red-500' : ''}`}
              />
              {errors.endDate && (
                <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Team Member Invites */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={`text-sm font-medium ${
                state.darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <Mail className="h-4 w-4 inline mr-1" />
                Invite Team Members (Email)
              </label>
              <button
                type="button"
                onClick={addEmailField}
                className={`flex items-center space-x-1 text-sm px-3 py-1 rounded-lg transition-colors duration-200 ${
                  state.darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Plus className="h-3 w-3" />
                <span>Add Email</span>
              </button>
            </div>

            <div className="space-y-2">
              {invitedEmails.map((email, index) => (
                <div key={`email-field-${index}-${email || 'empty'}`} className="flex space-x-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => updateEmail(index, e.target.value)}
                    className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      state.darkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="colleague@example.com"
                  />
                  {invitedEmails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEmailField(index)}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        state.darkMode
                          ? 'text-red-400 hover:bg-gray-700'
                          : 'text-red-500 hover:bg-gray-100'
                      }`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.emails && (
              <p className="text-red-500 text-sm mt-1">{errors.emails}</p>
            )}
            <p className={`text-xs mt-2 ${
              state.darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Invited members will receive an email to join the project
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-2 border rounded-lg font-medium transition-colors duration-200 ${
                state.darkMode
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
