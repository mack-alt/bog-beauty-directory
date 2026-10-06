(function () {
  var STAGES = [
    {
      id: "visit-1",
      title: "Visit 1",
      from: "1. Visit 1, 2. Gift hand-over, 3. Checklist, 4. Text the link, 5. How it goes live, 6. End Visit 1, 11. Vietnamese and Spanish",
      scenarios: [
        {
          id: "at-the-door",
          title: "At the door",
          from: "1. Visit 1 — Owner is there",
          next: "give-the-gift",
          blocks: [
            {
              say: "Hi! I'm Kenny with Blades of Grass, the local beauty directory here in [city]. I made something for your shop. It's free, nothing to buy. Can I show you? It takes one minute.",
              tips: [
                "🆕 Say the shop's own city (Kent, Tukwila, Renton...), not yours.",
                "Name the gift the first time they ask. \"A free website and directory listing for your shop. Here, I'll show you.\"",
                "Get her name right. Not sure? \"Did I get that right? Mai?\"",
                "Visit 1 never mentions price. It's a gift.",
                "Nerves are normal. Take a breath, say one sentence, then stop and let her talk."
              ]
            }
          ]
        },
        {
          id: "back-after-a-stop",
          title: "Back after a first stop",
          from: "1. Visit 1 — Back after a first stop",
          next: "give-the-gift",
          blocks: [
            {
              cue: "Back after a first stop (you got her card before)",
              say: "Hi [name]! Kenny from Blades of Grass. I stopped by a couple weeks ago and you gave me your card. I made your shop a free website and directory listing. Got a minute to see it?",
              tips: ["She remembers you? \"You remembered! Thank you.\""]
            }
          ]
        },
        {
          id: "owners-busy",
          title: "Owner's busy",
          from: "1. Visit 1 — Busy shop",
          next: "give-the-gift",
          blocks: [
            {
              cue: "Busy shop (chairs full, phone ringing)",
              say: "You're slammed! I won't keep you. I made your shop a free website and directory listing. Want a 10-second look, or should I just text you the link?",
              tips: [
                "She wants to see it first? Show it right away, then: \"Want me to text it to you so it's on your phone?\" No number? Leave your card and say: \"Text me when it's slow and I'll send it.\"",
                "\"Show me\" means show it now. Don't offer to come back. She decides how much time she has."
              ]
            }
          ]
        },
        {
          id: "owners-out",
          title: "Owner's out",
          from: "1. Visit 1 — staff only",
          blocks: [
            {
              cue: "Only staff are there / come back",
              say: "Hi! I made a free gift for the owner. Could you give her this? What's her name, and when's a good time to catch her? I'll stop back then."
            },
            {
              cue: "If you're selling something, the owner's not here.",
              say: "Nothing to buy. I made a free website and directory listing for the owner. Can I show you, so you know what to tell her?"
            },
            {
              cue: "Staff won't give the owner's number",
              say: "No problem. Can I text it to the shop number? You can show her."
            },
            {
              cue: "\"What should I tell her?\" / \"Does she need anything ready?\"",
              say: "Tell her Kenny made her a free website and listing. Nothing to prepare. About 10 minutes to check it together. Thanks for passing it along!"
            }
          ]
        },
        {
          id: "give-the-gift",
          title: "Give the gift",
          from: "2. Gift hand-over — Sample site and banner; 4. Text her the gift link",
          next: "big-question",
          blocks: [
            {
              cue: "Sample site (no website, or the site is dead)",
              say: "I built this for you: a one-page site with your menu and hours, so people can find you. Here it is on my phone."
            },
            {
              say: "It's private. Only people with this link can see it. It stays private until you say yes."
            },
            {
              cue: "Show her the top of the site (the banner)",
              say: "See the top? 'A free gift for [shop] from Blades of Grass.'"
            },
            {
              say: "This button is your free listing. This one, 'Help make this better,' is a short list so it looks just like you."
            },
            {
              say: "Want me to text you the link so it's on your phone?",
              tips: [
                "Show it, then ask for the number. Owners give their number after they see their shop's name.",
                "Pick the gift that fits what the shop is missing.",
                "Open your Gift Kit page → tap Text link under her shop → type her number → send. It says: \"Hi! Here's the free website I made for your shop: [link] - Kenny, Blades of Grass.\" It's a normal text from your own phone. Only text people who said yes."
              ]
            }
          ]
        },
        {
          id: "other-gifts",
          title: "Other gifts",
          from: "2. Gift hand-over — Checkup, listing, sign",
          next: "give-the-gift",
          blocks: [
            {
              cue: "Front Door Checkup (wrong phone, wrong hours, messy Google page, hijacked site)",
              say: "I checked how customers find you online. A few things were sending people the wrong way. I fixed [3] of them in our directory. Here's the list for Google."
            },
            {
              cue: "Free listing (hard to find, not in our directory yet)",
              say: "You're in our local beauty directory now, free. Can you check that I got your phone number and hours right?"
            },
            {
              cue: "Translated sign or menu (her clients speak another language, signs are English only)",
              say: "I made this sign in [language] for your clients. It says 'Text us to book.' It's yours to keep."
            }
          ]
        },
        {
          id: "while-she-looks",
          title: "Questions while she looks",
          from: "2. Gift hand-over — Questions she'll ask while she looks",
          next: "checklist",
          blocks: [
            { say: "\"Is this advertising?\" → \"No, it's a gift. I made your shop a free website and listing. Here, take a look.\"" },
            { say: "\"Is the website free too?\" / \"Is there a charge to keep it?\" → \"The website and the listing are free. It's a gift.\"" },
            { say: "\"That picture isn't our shop.\" → \"Right, those are sample photos. Text me yours and I'll swap them in.\"" },
            { say: "\"Can customers see this already?\" → \"Not yet. It's private until you say yes.\"" },
            { say: "\"How do I send you pictures?\" → \"Just text them to my number. The list is in the link.\"" }
          ],
          more: [
            {
              say: "\"Those hours are wrong.\" → \"Thank you! What should they be?\"",
              tips: ["Write it down. Fix it tonight."]
            },
            {
              cue: "Reveal moment (optional, never push)",
              say: "Can I take a quick photo of you with it? Only if you're comfortable. If not, no problem at all."
            }
          ]
        },
        {
          id: "checklist",
          title: "Hand her the checklist",
          from: "3. Hand her the checklist",
          next: "big-question",
          blocks: [
            {
              say: "This checklist helps us make it yours: your photos, menu, and hours. Right now it uses sample photos.",
              tips: ["Short checklist line: \"This checklist helps us make it yours: your photos, menu, and hours.\""]
            },
            { say: "Hours too, plus holiday or summer hours, so nobody shows up to a locked door." },
            { say: "The big one is your special offer or rewards program, like a first-visit deal or a punch card. We put it right at the top." },
            {
              say: "Send a little or a lot, whenever. Just text photos to my number, 206-743-6296.",
              tips: [
                "To go live we need photos, menu, hours, and her offer or rewards program. No rewards program yet? \"We can pick a simple one together.\"",
                "Your phone: 206-743-6296 · Email: mack@lovebog.com",
                "Gift Kit page (on your phone): https://mack-alt.github.io/bog-beauty-directory/sites/kit/",
                "Owner checklist (\"Help make this better\"): https://mack-alt.github.io/bog-beauty-directory/sites/help/",
                "Book a time with Kenny: https://api.leadconnectorhq.com/widget/bookings/bog-front-desk-demo"
              ]
            }
          ]
        },
        {
          id: "already-has-a-site",
          title: "She already has a site",
          from: "5. How does it go live?",
          next: "booksy-square-vagaro",
          blocks: [
            {
              cue: "I already have a website.",
              say: "Great! If you own your web address, we just point it at the new page. It takes about 10 minutes once you log in. Then you can cancel the old hosting if you want."
            },
            {
              cue: "I have someone who does my website.",
              say: "That's great, keep them! The listing is yours either way. Want to check your info on it?"
            },
            {
              cue: "Who owns it?",
              say: "You do. Your web address is always yours, never ours."
            },
            {
              cue: "Old address expired?",
              say: "Let me check if we can buy it back. If not, we'll pick a close new name."
            },
            {
              cue: "How do you make money? Will I have to pay to stay in the directory?",
              say: "The listing stays free. I like getting to know shop owners, so if I ever have something that helps, it's an easy ask. No pressure."
            }
          ]
        },
        {
          id: "doesnt-want-a-website",
          title: "She doesn't want a website (but hers could use fresh eyes)",
          from: "5. She doesn't want a website (but hers could use fresh eyes)",
          next: "big-question",
          blocks: [
            {
              say: "When: she says no to a new site, and you've checked that her current site could use an update."
            },
            {
              cue: "1. Respect the no",
              say: "Totally fair, you've already got a site. Can I leave you something small anyway?"
            },
            {
              cue: "2. Give the gift (hand her the card or text it)",
              say: "I took a look and wrote down 3 quick things that could bring in more bookings. It's free, and you or your web person can do them."
            },
            {
              cue: "3. Big Question",
              say: "\"Of those 3, which one bugs you most?\" Or: \"What do you wish your site did better?\""
            },
            {
              cue: "4. Leave with a day",
              say: "I'll swing by Thursday to see if any of it helped.",
              tips: [
                "Common fixes to look for: Book button hard to find, old hours or prices, slow or broken on a phone, no photos of her work, no way to text the shop (that one sets up Visit 2). She keeps full control of her site.",
                "before the visit, write the 3 fixes on a \"3 things I fixed for you\" style note (see gift-picker.md). Don't invent results."
              ]
            }
          ]
        },
        {
          id: "no-website",
          title: "No website yet",
          from: "5. How does it go live? — I don't have a website",
          next: "how-it-goes-live",
          blocks: [
            {
              cue: "I don't have a website / I don't have a web address.",
              say: "No problem. It can go live free on our directory address right away."
            },
            {
              say: "Want your own name, like [shopname].com? That's about $12 to $20 a year from the web address company. You buy it in your name. I'll help you do it right here.",
              tips: ["That's the web address company's price, not ours. It's not a BoG price, so it's OK on Visit 1."]
            }
          ]
        },
        {
          id: "booksy-square-vagaro",
          title: "Booksy, Square, or Vagaro",
          from: "5. How does it go live? — I use Square / Vagaro / Booksy",
          next: "big-question",
          blocks: [
            {
              cue: "I use Square / Vagaro / Booksy.",
              say: "Keep it! Your Book button goes straight to it. Nothing changes for your clients."
            },
            { say: "Let's tap it together and make sure it opens your page." }
          ]
        },
        {
          id: "how-it-goes-live",
          title: "How does it go live?",
          from: "5. How does it go live?",
          next: "checklist",
          blocks: [
            {
              cue: "How does it go live?",
              say: "You say yes and send what you can from the list. We swap in your real stuff, turn off 'private,' and link it from your listing."
            }
          ]
        },
        {
          id: "big-question",
          title: "Big Question",
          from: "6. End every Visit 1 — The Big Question; also The Big Question section",
          next: "leaving",
          blocks: [
            {
              cue: "The Big Question",
              say: "Can I ask you one thing? What's the hardest part of running the shop right now?",
              tips: ["ask, then stay quiet 5 seconds, then write down her exact words"]
            },
            {
              say: "Thanks for telling me.",
              tips: [
                "Then write her words down. No pitch today. That's your Visit 2 opener.",
                "After she shares a headache, say \"Thanks for telling me.\" (Not \"Great.\") Write it down. No pitch on Visit 1.",
                "Get her talking about her problem, not you talking about yours. Ask, then stay quiet 5 seconds. Write down her exact words."
              ]
            }
          ],
          more: [
            {
              cue: "End of Visit 1",
              say: "What's the hardest part of running the shop right now?",
              tips: ["after the gift, no price"]
            }
          ]
        },
        {
          id: "leaving",
          title: "Leaving",
          from: "6. End every Visit 1 — referral, come-back, leaving; 4. Did it come through?",
          blocks: [
            {
              cue: "Come-back time (give two choices)",
              say: "Can I come back [Thursday] and show you how it looks with your whole menu? Is morning or afternoon better?",
              tips: [
                "🆕 Don't leave with \"sometime.\" Get a day and a time, then say it back: \"Thursday at ten. See you then!\"",
                "Leave with a day, a time, and the link on her phone. \"Did it come through?\" Then \"Thursday at ten. See you then.\""
              ]
            },
            {
              say: "Did it come through?",
              tips: ["Wait till she sees it before you leave."]
            },
            {
              cue: "Leaving",
              say: "Thanks for your time! Here's my card. Text me if anything on your page looks wrong."
            },
            {
              cue: "Referral",
              say: "Who else on this street should be in the directory?"
            }
          ]
        },
        {
          id: "vietnamese-opener",
          title: "Vietnamese opener",
          from: "11. Vietnamese — Visit 1 opener",
          next: "vietnamese-busy",
          blocks: [
            {
              say: "Chào chị! Tôi là Kenny, bên Blades of Grass, trang danh bạ làm đẹp ở khu này. Tôi có làm một món quà miễn phí cho tiệm, không cần mua gì cả. Chị xem thử một phút nhé?",
              tips: [
                "Vietnamese: say \"chị\" to a woman and \"anh\" to a man. \"Tôi\" means \"I\" (polite and neutral).",
                "have a native speaker check before you use these"
              ]
            }
          ]
        },
        {
          id: "vietnamese-busy",
          title: "Vietnamese, busy shop",
          from: "11. Vietnamese — Busy shop",
          next: "vietnamese-gift",
          blocks: [
            { say: "Chị đang bận quá! Tôi để quà ở đây và nhắn link cho chị nhé. Số điện thoại nào tiện nhất?" }
          ]
        },
        {
          id: "vietnamese-gift",
          title: "Vietnamese, the gift",
          from: "11. Vietnamese — Gift hand-over",
          blocks: [
            { cue: "Sample site", say: "Tôi làm cho tiệm một trang web miễn phí, có bảng giá và giờ mở cửa, để khách dễ tìm. Chị xem trên điện thoại nè. Trang này riêng tư, chỉ người có link mới xem được, cho đến khi chị đồng ý." },
            { cue: "Checkup", say: "Tôi đã kiểm tra thông tin của tiệm trên mạng. Có 3 chỗ làm khách tìm sai, tôi đã sửa trong danh bạ rồi. Đây là danh sách." },
            { cue: "Listing", say: "Tiệm của chị đã có trong danh bạ làm đẹp của khu mình, miễn phí. Chị kiểm tra giúp số điện thoại và giờ mở cửa đúng chưa?" },
            { cue: "Sign", say: "Tôi làm tấm bảng này bằng tiếng Việt cho khách của chị: 'Nhắn tin để đặt hẹn.' Chị giữ luôn nhé." },
            {
              cue: "Checklist",
              say: "Đây là danh sách nhỏ để trang web giống tiệm của chị hơn. Chị gửi hình qua tin nhắn cho tôi lúc nào cũng được.",
              tips: [
                "The checklist's back side is in Vietnamese.",
                "Closing asks and Visit 2 in VI/ES: we'll add these after a native speaker checks the lines above."
              ]
            }
          ]
        },
        {
          id: "spanish-opener",
          title: "Spanish opener",
          from: "11. Spanish — Visit 1 opener",
          next: "spanish-busy",
          blocks: [
            {
              say: "¡Hola! Soy Kenny, de Blades of Grass, un directorio local de belleza. Le hice un regalo gratis a su negocio. No tiene que comprar nada. ¿Se lo muestro? Es solo un minuto.",
              tips: ["have a native speaker check before you use these"]
            }
          ]
        },
        {
          id: "spanish-busy",
          title: "Spanish, busy shop",
          from: "11. Spanish — Busy shop",
          next: "spanish-gift",
          blocks: [
            { say: "¡Está muy ocupada! Le dejo esto y le mando el enlace por mensaje. ¿Cuál es el mejor número?" }
          ]
        },
        {
          id: "spanish-gift",
          title: "Spanish, the gift",
          from: "11. Spanish — Gift hand-over",
          blocks: [
            { cue: "Sample site", say: "Le hice una página web gratis con su menú y su horario, para que la gente encuentre su negocio. Mírela en mi teléfono. Es privada: solo la ve quien tiene el enlace, hasta que usted diga que sí." },
            { cue: "Checkup", say: "Revisé cómo encuentran su negocio en internet. Había tres cosas que confundían a la gente, y las arreglé en nuestro directorio. Aquí tiene la lista." },
            { cue: "Listing", say: "Su negocio ya está en nuestro directorio local de belleza, gratis. ¿Me confirma si el teléfono y el horario están bien?" },
            { cue: "Sign", say: "Le hice este letrero en español para sus clientes: 'Envíenos un mensaje de texto para hacer su cita.' Es suyo." }
          ]
        }
      ]
    },
    {
      id: "visit-2",
      title: "Visit 2",
      from: "8. Visit 2: the offer — opener, demo, founding offer",
      scenarios: [
        {
          id: "return-opener",
          title: "Return visit",
          from: "8. Visit 2 — Opener; The Big Question — Start of Visit 2",
          next: "demo",
          blocks: [
            {
              cue: "Opener (use her Big Question answer)",
              say: "Good to see you again! Last time you said [her words]. Is that still the biggest headache?"
            },
            {
              cue: "Or, if you didn't get an answer",
              say: "When you're with a client and the phone rings, what usually happens?"
            }
          ],
          more: [
            {
              cue: "Start of Visit 2",
              say: "Last time you said ___. Is that still the biggest headache?"
            }
          ]
        },
        {
          id: "call-test",
          title: "Call-test",
          from: "8. Visit 2 — Call-test note",
          next: "demo",
          blocks: [
            {
              cue: "Call-test note (only if it's true)",
              say: "I called your shop [Tuesday at 2:10] and nobody picked up. You were probably with a client. That caller might have tried somewhere else."
            }
          ]
        },
        {
          id: "demo",
          title: "At the demo",
          from: "8. Visit 2 — Demo and one-sentence promise",
          next: "offer",
          blocks: [
            { say: "You said [her words]. Here's what fixes that." },
            {
              say: "Watch. Someone calls, nobody can pick up, and they get a text right away to help them book.",
              tips: ["Show the demo. Stop talking and let her read it."]
            },
            {
              cue: "One-sentence promise",
              say: "When you miss a call, we text them back right away and help them book.",
              tips: [
                "Until the texting campaign is approved, use the phone demo. Don't say \"it's live.\"",
                "Don't promise text-back is live until texting is approved. You can show the demo.",
                "Texting: brand approved Oct 5. Campaign still in review. Until it's approved, show the demo but don't say \"it's live.\""
              ]
            }
          ],
          more: [
            {
              cue: "At the demo",
              say: "You said ___. Here's what fixes that."
            }
          ]
        },
        {
          id: "demo-questions",
          title: "Her questions at the demo",
          from: "8. Visit 2 — Her questions at the demo",
          next: "offer",
          blocks: [
            {
              cue: "Would it come from our shop number?",
              say: "Good question. Let me check that for your shop and tell you.",
              tips: [
                "Not confirmed yet. Don't say yes.",
                "whether texts can come from her own shop number isn't confirmed yet",
                "Visit 2: don't say \"yes\" to what isn't set. Texting live date, her shop number, and cancel terms aren't confirmed yet. Say \"Let me check and tell you.\""
              ]
            },
            {
              cue: "Who answers if they ask about prices or openings?",
              say: "It sends them your Booksy link so they book there. You pick the words, and you see every text."
            },
            {
              cue: "I want them booking in Booksy so we don't double-book.",
              say: "Perfect. We send them your Booksy link. Your calendar stays the boss."
            }
          ]
        },
        {
          id: "offer",
          title: "The $297 offer",
          from: "8. Visit 2 — The founding offer + guarantee, close, and $297 a month or one time",
          blocks: [
            {
              cue: "The founding offer + guarantee",
              say: "Founding shops pay $297 a month for the first 90 days. I set it all up, in your language. If you're not happy after month one, you get your money back or a credit.",
              tips: [
                "$297 a month, founding-shop price, first 90 days. Month one: happy, or money back or a credit.",
                "$297 is the founding price for the first 90 days (later price not set)"
              ]
            },
            {
              cue: "$297 a month, or one time?",
              say: "$297 a month. That's the founding price for the first 90 days."
            },
            {
              cue: "Close",
              say: "Want to be one of the first shops on this street? I can set it up today, or come back Monday. Which is better?"
            }
          ]
        }
      ]
    },
    {
      id: "she-says-yes",
      title: "She says yes",
      from: "8. Visit 2 — payment, charge day, Plan B, checklist, cancel; 9. Annual offer; 10. After 90 days",
      scenarios: [
        {
          id: "yes-line",
          title: "She says yes",
          from: "8. Visit 2 — Card at the yes",
          next: "charge-today",
          blocks: [
            {
              cue: "Card at the yes (taking payment)",
              say: "Great! I'm sending you a secure payment link right now. It's $297 a month, charged automatically, and you get a receipt every time. Go ahead and tap it. I'll wait.",
              tips: ["🆕 Until texting is approved, don't send the payment link at the yes. Book the setup day, use the Plan B line below, and send the link the day her text line goes live."]
            }
          ]
        },
        {
          id: "charge-today",
          title: "Does this charge me today?",
          from: "8. Visit 2 — Does this charge me today?",
          next: "text-line-setup",
          blocks: [
            {
              cue: "Does this charge me today?",
              say: "No. Your first charge starts the day your text line goes live.",
              tips: ["first charge starts the day her text line goes live"]
            }
          ]
        },
        {
          id: "text-line-setup",
          title: "What happens next",
          from: "8. Visit 2 — Plan B and Will the texting be ready Monday?",
          next: "getting-set-up",
          blocks: [
            {
              cue: "If texting isn't approved yet (Plan B)",
              say: "Your text line is finishing setup with the phone companies. Your first charge starts the day it goes live. I'll text you that morning."
            },
            {
              cue: "Will the texting be ready Monday?",
              say: "We'll get the setup done Monday. The text line is still waiting on phone-company approval. I'll let you know when it's ready, and your first charge starts when it goes live."
            }
          ]
        },
        {
          id: "getting-set-up",
          title: "Getting set up",
          from: "8. Visit 2 — checklist and check or Zelle",
          blocks: [
            {
              cue: "Then the checklist + shop profile",
              say: "Last thing: the checklist. Your menu, hours, and your offer go into your site and your front desk. Your friends can test it before it goes live."
            },
            {
              cue: "If she'd rather pay by check or Zelle",
              say: "That works too. I'll send you an invoice, and I'll mark it paid when it comes in.",
              tips: ["Until texting is approved, email the invoice or send the link from your own phone."]
            }
          ]
        },
        {
          id: "shop-number",
          title: "Texts from her shop number",
          from: "8. Visit 2 — Would it come from our shop number?",
          blocks: [
            {
              cue: "Would it come from our shop number?",
              say: "Good question. Let me check that for your shop and tell you.",
              tips: [
                "Not confirmed yet. Don't say yes.",
                "whether texts can come from her own shop number isn't confirmed yet",
                "Say \"Let me check and tell you.\""
              ]
            }
          ]
        },
        {
          id: "cancel",
          title: "Can I cancel?",
          from: "8. Visit 2 — Is there a contract? Can I cancel?",
          blocks: [
            {
              cue: "Is there a contract? Can I cancel?",
              say: "Month one is guaranteed. If you're not happy, you get your money back or a credit.",
              tips: [
                "Cancel terms after month one aren't set yet. Don't promise more than that.",
                "cancel terms aren't set, so only promise the month-one guarantee",
                "Say \"Let me check and tell you.\""
              ]
            }
          ]
        },
        {
          id: "after-90-days",
          title: "After 90 days",
          from: "10. Top objections — What happens after 90 days?",
          blocks: [
            {
              cue: "What happens after 90 days?",
              say: "Good question. You're a founding shop, so that's your price for the first 90 days. I'll sit down with you well before then and go over it.",
              tips: ["Don't promise a day-91 price. It isn't set yet."]
            }
          ]
        },
        {
          id: "annual-offer",
          title: "Annual offer",
          from: "9. Annual offer",
          blocks: [
            {
              say: "Your first month: [real count] missed calls texted back, [real count] booked.",
              tips: [
                "Lead with the bonuses, not the discount.",
                "Never make up results. Only quote a shop's real counts, with her OK."
              ]
            },
            { say: "Want to make it a full year? You get [bonus 1] and [bonus 2]." },
            {
              say: "The year is $2,970. That's like 2 months free.",
              tips: ["Use her real numbers only, even small ones. Bonuses aren't picked yet, so don't name one that isn't real. Don't promise any price after day 90. Just say \"founding price.\""]
            }
          ]
        }
      ]
    },
    {
      id: "she-says-no",
      title: "She says no / not now",
      from: "10. Top objections and 8. If she says no",
      scenarios: [
        {
          id: "too-busy",
          title: "I'm too busy",
          from: "10. I'm too busy",
          next: "stay-friendly",
          blocks: [
            {
              cue: "I'm too busy.",
              say: "That's exactly why I'm here. You're busy with clients, so calls get missed. This answers them for you. I do the setup, and you just keep working."
            }
          ]
        },
        {
          id: "too-expensive",
          title: "It's too expensive",
          from: "10. It's too expensive",
          next: "stay-friendly",
          blocks: [
            {
              cue: "It's too expensive.",
              say: "Fair question. What's one regular client worth to you in a year? If this keeps one from going somewhere else, does it pay for itself? And month one is guaranteed."
            }
          ]
        },
        {
          id: "already-booksy",
          title: "Already has Booksy",
          from: "10. I already have Vagaro",
          next: "stay-friendly",
          blocks: [
            {
              cue: "\"I already have Vagaro\" (or Booksy, Square, etc.)",
              say: "Great, keep it! This doesn't replace it. When someone calls and you can't pick up, we text them your Vagaro link so they book there."
            }
          ]
        },
        {
          id: "keep-her-website",
          title: "Keep her website",
          from: "10. I already have a website",
          next: "stay-friendly",
          blocks: [
            {
              cue: "I already have a website.",
              say: "Keep your address! We point it at the new page, and your booking stays the same. You still own it."
            }
          ]
        },
        {
          id: "ask-partner",
          title: "She needs to ask someone",
          from: "10. I need to ask my husband / partner",
          next: "stay-friendly",
          blocks: [
            {
              cue: "I need to ask my husband / partner.",
              say: "Of course. Can I come back when he's here? What day works for you both? Or pick a time here.",
              tips: ["Book a time with Kenny: https://api.leadconnectorhq.com/widget/bookings/bog-front-desk-demo"]
            }
          ]
        },
        {
          id: "send-info",
          title: "Just send me some info",
          from: "10. Just send me some info",
          next: "stay-friendly",
          blocks: [
            {
              cue: "Just send me some info.",
              say: "Sure! I'll text you your site and a link to pick a time. Can I stop by Friday for any questions?"
            }
          ]
        },
        {
          id: "texting-worry",
          title: "She doesn't trust the texts",
          from: "10. I don't trust texting robots",
          next: "stay-friendly",
          blocks: [
            {
              cue: "I don't trust texting robots.",
              say: "I get it, me too. You pick the words, in your language. You see every text. Your friends and family test it first. Want to see it on my phone right now?"
            }
          ]
        },
        {
          id: "stay-friendly",
          title: "Stay friendly",
          from: "8. If she says no",
          blocks: [
            {
              cue: "If she says no",
              say: "No problem at all. Your listing stays free either way. Can I check back next month?"
            }
          ]
        }
      ]
    },
    {
      id: "follow-up",
      title: "Follow-up texts",
      from: "7. Follow-up texts",
      scenarios: [
        {
          id: "after-visit-1",
          title: "After Visit 1",
          from: "7. Same day, after the visit",
          next: "before-visit-2",
          blocks: [
            {
              cue: "Same day, after the visit",
              say: "Hi [name], it's Kenny from Blades of Grass. Thanks for your time today! Here's your free site again: [link]. Tap 'Help make this better' for the short list. Text me photos anytime. See you [Thursday]!",
              tips: ["Only text people who gave you their number. The Gift Kit's Text link fills in the link for you."]
            }
          ]
        },
        {
          id: "left-the-gift",
          title: "You left the gift",
          from: "7. Busy shop (you left the gift, didn't get to talk)",
          next: "before-visit-2",
          blocks: [
            {
              cue: "Busy shop (you left the gift, didn't get to talk)",
              say: "Hi! It's Kenny from Blades of Grass. I stopped by today, you were slammed! Here's the free site I made for your shop: [link]. When's a slow time for 2 minutes?"
            }
          ]
        },
        {
          id: "before-visit-2",
          title: "Reminder before Visit 2",
          from: "7. Day before Visit 2",
          blocks: [
            {
              cue: "Day before Visit 2",
              say: "Hi [name], Kenny here. Still good for [Thursday morning]? I'll bring your site with your menu."
            }
          ]
        }
      ]
    }
  ];

  var lastFocus = "";
  var titleEl = document.getElementById("title");
  var whereEl = document.getElementById("where");
  var findForm = document.getElementById("find");
  var queryEl = document.getElementById("q");
  var listEl = document.getElementById("list");
  var barEl = document.getElementById("bar");
  var backBtn = document.getElementById("back");
  var nextBtn = document.getElementById("next");

  function findStage(id) {
    for (var i = 0; i < STAGES.length; i++) if (STAGES[i].id === id) return STAGES[i];
    return null;
  }

  function findScenario(stage, id) {
    if (!stage) return null;
    for (var i = 0; i < stage.scenarios.length; i++) {
      if (stage.scenarios[i].id === id) return stage.scenarios[i];
    }
    return null;
  }

  function route() {
    var raw = "";
    try { raw = decodeURIComponent((location.hash || "").replace(/^#/, "")); } catch (err) { raw = ""; }
    var bits = raw.split("/").filter(Boolean);
    var stage = findStage(bits[0] || "");
    var scenario = stage ? findScenario(stage, bits[1] || "") : null;
    return { stage: stage, scenario: scenario, stageId: bits[0] || "", scenarioId: bits[1] || "" };
  }

  function go(hash) {
    var next = hash ? "#" + hash : location.pathname + location.search;
    if (!hash) {
      history.pushState(null, "", next);
      paint();
      return;
    }
    if (location.hash === next) paint();
    else location.hash = hash;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function button(label, hash, small) {
    var el = document.createElement("button");
    el.type = "button";
    if (small) {
      el.className = "hit";
      el.appendChild(document.createTextNode(label));
      var note = document.createElement("small");
      note.textContent = small;
      el.appendChild(note);
    } else {
      el.textContent = label;
    }
    el.addEventListener("click", function () { go(hash); });
    return el;
  }

  function addBlock(parent, block) {
    var wrap = document.createElement("div");
    wrap.className = "block";
    if (block.cue) {
      var cue = document.createElement("p");
      cue.className = "cue";
      cue.textContent = block.cue;
      wrap.appendChild(cue);
    }
    var say = document.createElement("p");
    say.className = "say";
    say.textContent = block.say;
    wrap.appendChild(say);
    (block.tips || []).forEach(function (tip) {
      var p = document.createElement("p");
      p.className = "tip";
      appendTip(p, tip);
      wrap.appendChild(p);
    });
    parent.appendChild(wrap);
  }

  function appendTip(p, tip) {
    var bits = tip.split(/(https:\/\/[^\s]+)/);
    bits.forEach(function (bit) {
      if (/^https:\/\//.test(bit)) {
        var a = document.createElement("a");
        a.href = bit;
        a.textContent = bit;
        a.style.color = "#1f5c3f";
        p.appendChild(a);
      } else if (bit) {
        p.appendChild(document.createTextNode(bit));
      }
    });
  }

  function blob(scenario) {
    var parts = [scenario.title];
    (scenario.blocks || []).concat(scenario.more || []).forEach(function (block) {
      parts.push(block.cue || "", block.say || "", (block.tips || []).join(" "));
    });
    return parts.join(" ").toLowerCase();
  }

  function paint() {
    var here = route();
    var q = (queryEl.value || "").trim().toLowerCase();
    clear(listEl);
    nextBtn.classList.add("hidden");
    barEl.classList.add("hidden");
    whereEl.classList.add("hidden");
    findForm.classList.remove("hidden");

    if (!here.stage || (here.scenarioId && !here.scenario)) {
      titleEl.textContent = "Scripts";
      if (!q) {
        STAGES.forEach(function (stage) {
          listEl.appendChild(button(stage.title, stage.id));
        });
      } else {
        var hits = 0;
        STAGES.forEach(function (stage) {
          stage.scenarios.forEach(function (scenario) {
            if (blob(scenario).indexOf(q) === -1) return;
            hits += 1;
            listEl.appendChild(button(scenario.title, stage.id + "/" + scenario.id, stage.title));
          });
        });
        if (!hits) {
          var empty = document.createElement("p");
          empty.className = "empty";
          empty.textContent = "Nothing matches.";
          listEl.appendChild(empty);
        }
      }
      if (lastFocus !== "home") titleEl.focus();
      lastFocus = "home";
      return;
    }

    findForm.classList.add("hidden");
    barEl.classList.remove("hidden");
    backBtn.onclick = function () {
      go(here.scenario ? here.stage.id : "");
    };

    if (!here.scenario) {
      titleEl.textContent = here.stage.title;
      here.stage.scenarios.forEach(function (scenario) {
        listEl.appendChild(button(scenario.title, here.stage.id + "/" + scenario.id));
      });
      var stageKey = here.stage.id;
      if (lastFocus !== stageKey) titleEl.focus();
      lastFocus = stageKey;
      return;
    }

    titleEl.textContent = here.scenario.title;
    whereEl.textContent = here.stage.title;
    whereEl.classList.remove("hidden");
    (here.scenario.blocks || []).forEach(function (block) { addBlock(listEl, block); });
    if (here.scenario.more && here.scenario.more.length) {
      var details = document.createElement("details");
      var summary = document.createElement("summary");
      summary.textContent = "More";
      details.appendChild(summary);
      here.scenario.more.forEach(function (block) { addBlock(details, block); });
      listEl.appendChild(details);
    }
    var next = findScenario(here.stage, here.scenario.next || "");
    if (next) {
      nextBtn.classList.remove("hidden");
      nextBtn.textContent = "Next: " + next.title;
      nextBtn.onclick = function () { go(here.stage.id + "/" + next.id); };
    }
    var sceneKey = here.stage.id + "/" + here.scenario.id;
    if (lastFocus !== sceneKey) titleEl.focus();
    lastFocus = sceneKey;
  }

  findForm.addEventListener("submit", function (event) { event.preventDefault(); });
  queryEl.addEventListener("input", function () {
    if (location.hash) go("");
    else paint();
  });
  window.addEventListener("hashchange", paint);
  window.addEventListener("popstate", paint);
  paint();
})();
