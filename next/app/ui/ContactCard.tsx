import React from "react";

interface Contact {
  _id: string;
  name: string;
  profilePicture?: string;
}

interface ContactCardProps {
  contact: Contact;
  onlineUsers: string[];
  onSelect: (contact: Contact) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, onlineUsers, onSelect }) => {
  const isOnline = onlineUsers.includes(contact._id);

  return (
    <div
      className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
      onClick={() => onSelect(contact)}
    >
      <div className="flex items-center gap-3">
        <div className={`avatar ${isOnline ? "avatar-online" : "avatar-offline"}`}>
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full overflow-hidden">
            <img src={contact.profilePicture || "/avatar.png"} alt={contact.name} />
          </div>
        </div>
        <h4 className="text-black font-medium">{contact.name}</h4>
      </div>
    </div>
  );
};

export default ContactCard;
