import type { Block } from 'payload'

export const ContactHero: Block = {
  slug: 'contactHero',
  fields: [
    {
      name: 'tag',
      type: 'text',
      required: true,
      defaultValue: 'Get in Touch',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Ready to Discuss Your Legal Strategy?',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      defaultValue: 'Reach out to Chambers of Jeet Bhatt for expert legal guidance and consultations.',
    },
    {
      name: 'phone',
      type: 'text',
      defaultValue: '+91 94082 82982',
    },
    {
      name: 'email',
      type: 'text',
      defaultValue: 'info@jeetbhatt.com',
    }
  ],
}

export const ContactInfo: Block = {
  slug: 'contactInfo',
  fields: [
    {
      name: 'infoItems',
      type: 'array',
      fields: [
        {
          name: 'icon',
          type: 'select',
          options: [
            { label: 'Phone', value: 'Phone' },
            { label: 'Mail', value: 'Mail' },
            { label: 'Map Pin', value: 'MapPin' },
            { label: 'Clock', value: 'Clock' },
          ],
          defaultValue: 'Phone',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'textarea',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
        }
      ]
    }
  ],
}

export const ContactFormBlock: Block = {
  slug: 'contactForm',
  fields: [
    {
      name: 'badge',
      type: 'text',
      defaultValue: 'Direct Inquiry',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Send a Message',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      defaultValue: 'Have a complex legal question? Fill out the form and our specialist team will reach out with a strategic roadmap.',
    },
    {
      name: 'features',
      type: 'array',
      fields: [
        {
          name: 'icon',
          type: 'select',
          options: [
            { label: 'Clock', value: 'Clock' },
            { label: 'Users', value: 'Users' },
            { label: 'Shield Check', value: 'ShieldCheck' },
          ],
          defaultValue: 'ShieldCheck',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        }
      ]
    }
  ],
}

export const ContactMap: Block = {
  slug: 'contactMap',
  fields: [
    {
      name: 'mapUrl',
      type: 'text',
      required: true,
      defaultValue: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.697926017772!2d72.5222!3d23.0784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e833444444445%3A0x6b74ad4a4e63480e!2sSG+Business+Hub!5e0!3m2!1sen!2sin!4v1710450000000!5m2!1sen!2sin',
    },
    {
      name: 'locationTitle',
      type: 'text',
      defaultValue: 'Main Chamber',
    },
    {
      name: 'locationAddress',
      type: 'textarea',
      defaultValue: 'SG Business Hub, Sola,\nSG Highway, Ahmedabad',
    }
  ],
}
