# Email Templates — Oil City Ready Mix Ltd.

Three templates support the quote form workflow (WF-01).
Build these **before** building WF-01.

Naming convention: `ET-##`

---

## Form Fields (from the quote request form)

| Form Field           | GHL Merge Tag              |
|----------------------|----------------------------|
| Company Name         | `{{contact.company_name}}` |
| Ordering Person Name | `{{contact.name}}`         |
| Email                | `{{contact.email}}`        |
| Contact Number       | `{{contact.phone}}`        |
| Address (optional)   | `{{contact.address1}}`     |

---

## ET-01: Quote Request Confirmation (to Contact)

**ID:** ET-01
**Sent to:** The person who submitted the quote form
**Sent by:** WF-01, Step 3 — immediately after form submission
**Subject line:** {{contact.name}}, we received your quote request — Oil City Ready Mix Ltd.

---

**Email Body:**

```
Hi {{contact.name}},

Thank you for reaching out to Oil City Ready Mix Ltd.

We've received your request for {{contact.company_name}} and our team will
be in touch with a detailed quote within 1 business day.

Here's what happens next:

1. Our team reviews your project requirements
2. We prepare your concrete quote (volume, strength, schedule)
3. We contact you via phone or email to confirm the details

In the meantime, feel free to reach us at:

Phone: 780-318-4949
Email: [accounts@oilcityreadymix.net](mailto:accounts@oilcityreadymix.net)

Monday – Friday: 8:00 AM – 5:00 PM
Saturday: 8:00 AM – 1:00 PM

We look forward to working with you.

Oil City Ready Mix Ltd.
507, 509 15 Avenue, Nisku, AB T9E 7M6
https://oilcityreadymix.com

```

---

## ET-02: Internal New Quote Alert (to Staff)

**ID:** ET-02
**Sent to:** Assigned team member / office inbox (set in workflow Send Internal Notification action)
**Sent by:** WF-01, Step 4 — immediately after ET-01 sends
**Subject line:** New Quote Request — {{contact.name}} | {{contact.company_name}} | {{contact.phone}}

---

**Email Body:**

```
New quote request received via the website.

CONTACT DETAILS
───────────────
Company:  {{contact.company_name}}
Name:     {{contact.name}}
Phone:    {{contact.phone}}
Email:    {{contact.email}}
Address:  {{contact.address1}}

ACTION REQUIRED
───────────────
Review the request and send a concrete quote within 1 business day.

This contact has been added to PL-01: Concrete Quote Pipeline → Stage: New Request.
```

---

## ET-03: Quote Follow-Up (to Contact)

**ID:** ET-03
**Sent to:** The contact
**Sent by:** WF-01, Step 6 — 2 days after ET-01, only if no reply yet
**Subject line:** {{contact.name}}, following up on your concrete quote — Oil City Ready Mix Ltd.

---

**Email Body:**

```
Hi {{contact.name}},

We wanted to follow up on the quote request submitted for {{contact.company_name}}
a couple of days ago.

Our team is ready to help with your project. If you have any questions or would
like to discuss your requirements, don't hesitate to reach out.

  Phone: 780-318-4949
  Email: accounts@oilcityreadymix.net

  Monday – Friday: 8:00 AM – 5:00 PM
  Saturday: 8:00 AM – 1:00 PM

We look forward to hearing from you.

— The Oil City Ready Mix Team
Oil City Ready Mix Ltd.
507, 509 15 Avenue, Nisku, AB T9E 7M6
https://oilcityreadymix.com
```

---

## How to Build in GHL

1. Go to: **Marketing → Emails → Templates → + New**
2. Use the naming convention `ET-01`, `ET-02`, `ET-03` as the template name
3. Copy the body content above into the template editor
4. Save each template before building WF-01

**Build order:** ET-01 → ET-02 → ET-03 → then build WF-01

---

## Dependencies

| Depends On | Status          |
|------------|-----------------|
| Nothing    | Build these first |

| What Depends On These        | Component                              |
|------------------------------|----------------------------------------|
| WF-01: Quote Form Submission | workflows/01-quote-form-submission/    |
