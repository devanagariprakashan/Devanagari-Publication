-- Devanagari Publications seed data

-- categories
insert into public.categories (id, name, slug, is_active) values ('current-affairs', 'Current Affairs', 'current-affairs', true) on conflict (id) do nothing;
insert into public.categories (id, name, slug, is_active) values ('civil-judge', 'Civil Judge', 'civil-judge', true) on conflict (id) do nothing;
insert into public.categories (id, name, slug, is_active) values ('general-knowledge', 'General Knowledge', 'general-knowledge', true) on conflict (id) do nothing;
insert into public.categories (id, name, slug, is_active) values ('mppsc', 'MPPSC', 'mppsc', true) on conflict (id) do nothing;
insert into public.categories (id, name, slug, is_active) values ('upsc', 'UPSC', 'upsc', true) on conflict (id) do nothing;
insert into public.categories (id, name, slug, is_active) values ('literature', 'Literature', 'literature', true) on conflict (id) do nothing;
insert into public.categories (id, name, slug, is_active) values ('other', 'Other', 'other', true) on conflict (id) do nothing;

-- authors
insert into public.authors (id, name, role, short_role, bio, image_url, is_active) values ('mayank-jagdish-sharma', 'Mr. Mayank Jagdish Sharma', 'Faculty, Hindi Sahitya And Vyakaran', 'Hindi Sahitya & Vyakaran', 'Renowned Hindi literature & grammar mentor for MPPSC, Civil Services and State exams. Guided 15,000+ selected candidates.', '/images/authors/mayank-sharma.jpg', true) on conflict (id) do nothing;
insert into public.authors (id, name, role, short_role, bio, image_url, is_active) values ('shubham-gupta', 'Mr. Shubham Gupta', 'GS Faculty & Prelims Strategist', 'GS & Current Affairs', 'Top General Studies educator specializing in high-yield Prelims notes, quick revision charts and analytical GS.', '/images/authors/shubham-gupta.jpg', true) on conflict (id) do nothing;
insert into public.authors (id, name, role, short_role, bio, image_url, is_active) values ('anand-mishra', 'Mr. Anand Mishra', 'Director - Raksha Academy • Faculty - Ethics', 'Ethics & Integrity (Paper 4)', 'Director of Raksha Academy, senior philosopher & ethics mentor known for case-study frameworks in Paper-4.', '/images/authors/anand-mishra.jpg', true) on conflict (id) do nothing;
insert into public.authors (id, name, role, short_role, bio, image_url, is_active) values ('sunita-trivedi', 'Dr. Sunita Trivedi', 'Dean & Faculty - Law & Judicial Exams', 'Law & Judicial Services', 'Authoritative jurist and mentor for Civil Judge, ADPO and Higher Judicial Services across Madhya Pradesh, UP & Rajasthan.', '/images/authors/sunita-trivedi.jpg', true) on conflict (id) do nothing;
insert into public.authors (id, name, role, short_role, bio, image_url, is_active) values ('rajeshwar-sharma', 'Prof. Rajeshwar Sharma', 'Senior Academician & MP Historian', 'MP History & Culture', 'Distinguished historian, researcher and state awardee specializing in ancient and medieval tribal history of Central India.', '/images/authors/rajeshwar-sharma.jpg', true) on conflict (id) do nothing;
insert into public.authors (id, name, role, short_role, bio, image_url, is_active) values ('vivek-deshmukh', 'Adv. Vivek Deshmukh', 'Constitutional Law & Polity Expert', 'Polity & Constitution', 'Supreme Court & High Court advocate holding masterclasses on Constitution, Governance and Public Policy.', '/images/authors/vivek-deshmukh.jpg', true) on conflict (id) do nothing;

-- books
insert into public.books (id, slug, title, hindi_title, subtitle, author, category_id, isbn, edition, language, exam, format, price, original_price, discount_percent, rating, reviews_count, badge, badge_color, image_url, description, highlights, pages, publication, binding, in_stock, is_bestseller, is_new_release, is_featured, show_in_hero, is_active) values ('101', 'samanya-hindi-evam-vyakaran-101', 'Samanya Hindi Evam Vyakaran', 'सामान्य हिन्दी एवं व्याकरण', 'मध्य प्रदेश लोक सेवा आयोग एवं अन्य राज्य परीक्षाओं हेतु संपूर्ण मानक पुस्तक', 'Mr. Mayank Jagdish Sharma', 'current-affairs', '978-93-87654-12-0', '3rd Edition 2025-26', 'Hindi', 'MPPSC State Services', 'Current Affairs', 900, 1000, 10, 4.9, 1876, 'BESTSELLER', 'bg-red-600 text-white', '/images/books/image-2.png', 'MPPSC Mains Paper 5 एवं SI, Patwari परीक्षाओं के लिए नवीनतम पाठ्यक्रम के अनुसार प्रामाणिक व्याकरण, शब्द सामर्थ्य एवं प्रारूप लेखन।', '["नवीनतम सिलेबस 2025 अनुरूप","विगत 10 वर्षों के हल प्रश्न","5000+ वस्तुनिष्ठ अभ्यास प्रश्न","प्रारूप लेखन व संक्षेपण"]', 680, 'Dnyanagari Prakashan', 'Paperback', true, true, false, true, true, true) on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, hindi_title = excluded.hindi_title,
  subtitle = excluded.subtitle, author = excluded.author, category_id = excluded.category_id,
  isbn = excluded.isbn, edition = excluded.edition, language = excluded.language,
  exam = excluded.exam, format = excluded.format, price = excluded.price,
  original_price = excluded.original_price, discount_percent = excluded.discount_percent,
  rating = excluded.rating, reviews_count = excluded.reviews_count, badge = excluded.badge,
  badge_color = excluded.badge_color, image_url = excluded.image_url,
  description = excluded.description, highlights = excluded.highlights, pages = excluded.pages,
  publication = excluded.publication, binding = excluded.binding, in_stock = excluded.in_stock,
  is_bestseller = excluded.is_bestseller, is_new_release = excluded.is_new_release,
  is_featured = excluded.is_featured, show_in_hero = excluded.show_in_hero, is_active = excluded.is_active;
insert into public.books (id, slug, title, hindi_title, subtitle, author, category_id, isbn, edition, language, exam, format, price, original_price, discount_percent, rating, reviews_count, badge, badge_color, image_url, description, highlights, pages, publication, binding, in_stock, is_bestseller, is_new_release, is_featured, show_in_hero, is_active) values ('102', 'nibandh-sanhita-102', 'Nibandh Sanhita', 'निबंध संहिता एवं प्रारूप लेखन', 'मुख्य परीक्षा विशेषांक, समसामयिक मुद्दे एवं प्रारूप चंद्रिका', 'Mr. Mayank Jagdish Sharma', 'current-affairs', '978-93-12345-678-9', '2025 (Latest Edition)', 'Hindi', 'MPPSC Prarambhik Pariksha', 'Current Affairs', 249, 349, 29, 4.9, 728, 'Bestseller', 'bg-[#C61821] text-white', '/images/books/image-3.png', '''निबंध संहिता'' MPPSC प्रारंभिक एवं मुख्य परीक्षा के लिए निबंध लेखन की एक अत्यंत उपयोगी पुस्तक है। इसमें 250+ निबंधों का संग्रह है जो विभिन्न विषयों को कवर करते हैं। पुस्तक में समसामयिक घटनाओं, आंकड़े और तथ्यों को शामिल किया गया है जो आपके निबंध को और अधिक प्रभावशाली बनाते हैं।', '["250+ निबंध संग्रह","अद्यतन आंकड़े","समसामयिक विषय","सरल व प्रभावशाली लेखन","परीक्षा दृष्टिकोण","परीक्षा उपयोगी संग्रह"]', 456, 'Dnyanagari Prakashan', 'Paperback', true, true, false, true, true, true) on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, hindi_title = excluded.hindi_title,
  subtitle = excluded.subtitle, author = excluded.author, category_id = excluded.category_id,
  isbn = excluded.isbn, edition = excluded.edition, language = excluded.language,
  exam = excluded.exam, format = excluded.format, price = excluded.price,
  original_price = excluded.original_price, discount_percent = excluded.discount_percent,
  rating = excluded.rating, reviews_count = excluded.reviews_count, badge = excluded.badge,
  badge_color = excluded.badge_color, image_url = excluded.image_url,
  description = excluded.description, highlights = excluded.highlights, pages = excluded.pages,
  publication = excluded.publication, binding = excluded.binding, in_stock = excluded.in_stock,
  is_bestseller = excluded.is_bestseller, is_new_release = excluded.is_new_release,
  is_featured = excluded.is_featured, show_in_hero = excluded.show_in_hero, is_active = excluded.is_active;
insert into public.books (id, slug, title, hindi_title, subtitle, author, category_id, isbn, edition, language, exam, format, price, original_price, discount_percent, rating, reviews_count, badge, badge_color, image_url, description, highlights, pages, publication, binding, in_stock, is_bestseller, is_new_release, is_featured, show_in_hero, is_active) values ('103', '-103', 'आधुनिक हिन्दी व्याकरण', 'आधुनिक हिन्दी व्याकरण एवं रचना', 'व्याकरण, रचना, मानक शब्दावली एवं भाषा चिंतन', 'Devanagari Publications', 'current-affairs', '978-93-87654-14-4', 'Standard Edition 2025', 'Hindi', 'MPPSC & SI Exams', 'Current Affairs', 449, 599, 25, 4.8, 1284, 'STANDARD', 'bg-emerald-600 text-white', '/images/books/adhunik-hindi.png', 'व्याकरण के समस्त नियमों, अपवादों एवं व्यावहारिक उदाहरणों का सरल एवं वैज्ञानिक प्रस्तुतीकरण।', '["संपूर्ण वर्ण विचार व संधि","समास व प्रत्यय विशेष","वाक्य शुद्धि व मुहावरे","अध्यापन एवं प्रतियोगी दोनों हेतु उपयुक्त"]', 512, null, null, true, true, false, true, false, true) on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, hindi_title = excluded.hindi_title,
  subtitle = excluded.subtitle, author = excluded.author, category_id = excluded.category_id,
  isbn = excluded.isbn, edition = excluded.edition, language = excluded.language,
  exam = excluded.exam, format = excluded.format, price = excluded.price,
  original_price = excluded.original_price, discount_percent = excluded.discount_percent,
  rating = excluded.rating, reviews_count = excluded.reviews_count, badge = excluded.badge,
  badge_color = excluded.badge_color, image_url = excluded.image_url,
  description = excluded.description, highlights = excluded.highlights, pages = excluded.pages,
  publication = excluded.publication, binding = excluded.binding, in_stock = excluded.in_stock,
  is_bestseller = excluded.is_bestseller, is_new_release = excluded.is_new_release,
  is_featured = excluded.is_featured, show_in_hero = excluded.show_in_hero, is_active = excluded.is_active;
insert into public.books (id, slug, title, hindi_title, subtitle, author, category_id, isbn, edition, language, exam, format, price, original_price, discount_percent, rating, reviews_count, badge, badge_color, image_url, description, highlights, pages, publication, binding, in_stock, is_bestseller, is_new_release, is_featured, show_in_hero, is_active) values ('104', 'mppsc-gs-paper-1-104', 'MPPSC प्रारंभिक परीक्षा GS Paper 1', 'मध्य प्रदेश लोक सेवा आयोग सामान्य अध्ययन', 'प्रथम प्रश्न पत्र - 10 इकाइयों का संपूर्ण विश्लेषणात्मक संकलन', 'Mr. Shubham Gupta', 'civil-judge', '978-93-87654-15-1', '2025 New Syllabus', 'Hindi', 'MPPSC Prelims', 'Civil Judge', 599, 799, 25, 4.7, 831, '2025 EDITION', 'bg-blue-600 text-white', '/images/books/image-10.png', 'MPPSC प्रारंभिक परीक्षा के बदले हुए 10 यूनिट पाठ्यक्रम का सटीक, तथ्यपरक एवं मानचित्र आधारित अध्ययन।', '["10 इकाइयों का पूर्ण समावेश","नवीनतम जनजाति व MP इतिहास","इन्फोग्राफिक्स व फ्लोचार्ट्स","प्रत्येक यूनिट के बाद 100 MCQs"]', 720, null, null, true, false, true, true, false, true) on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, hindi_title = excluded.hindi_title,
  subtitle = excluded.subtitle, author = excluded.author, category_id = excluded.category_id,
  isbn = excluded.isbn, edition = excluded.edition, language = excluded.language,
  exam = excluded.exam, format = excluded.format, price = excluded.price,
  original_price = excluded.original_price, discount_percent = excluded.discount_percent,
  rating = excluded.rating, reviews_count = excluded.reviews_count, badge = excluded.badge,
  badge_color = excluded.badge_color, image_url = excluded.image_url,
  description = excluded.description, highlights = excluded.highlights, pages = excluded.pages,
  publication = excluded.publication, binding = excluded.binding, in_stock = excluded.in_stock,
  is_bestseller = excluded.is_bestseller, is_new_release = excluded.is_new_release,
  is_featured = excluded.is_featured, show_in_hero = excluded.show_in_hero, is_active = excluded.is_active;
insert into public.books (id, slug, title, hindi_title, subtitle, author, category_id, isbn, edition, language, exam, format, price, original_price, discount_percent, rating, reviews_count, badge, badge_color, image_url, description, highlights, pages, publication, binding, in_stock, is_bestseller, is_new_release, is_featured, show_in_hero, is_active) values ('105', 'mp-gk-105', 'मध्य प्रदेश सामान्य ज्ञान (MP GK)', 'मध्य प्रदेश सामान्य ज्ञान मानचित्र संकलन', 'मानचित्र, सारणी एवं तथ्यात्मक संपूर्ण संकलन 2025-26', 'Mr. Mayank Jagdish Sharma', 'civil-judge', '978-93-87654-16-8', '2025-26 Color Edition', 'Hindi', 'MPPSC & State Exams', 'Civil Judge', 389, 550, 29, 4.9, 2890, 'TOP SELLER', 'bg-red-600 text-white', '/images/books/image-4.png', 'मध्य प्रदेश का इतिहास, कला, संस्कृति, भूगोल, अर्थव्यवस्था एवं प्रमुख विभूतियों का सचित्र विवरण।', '["60+ रंगीन मानचित्र","जनजातीय कला व स्वतंत्रता सेनानी","नवीनतम जिले व प्रशासनिक आंकड़े","1000+ वन-लाइनर फैक्ट्स"]', 460, null, null, true, true, false, true, true, true) on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, hindi_title = excluded.hindi_title,
  subtitle = excluded.subtitle, author = excluded.author, category_id = excluded.category_id,
  isbn = excluded.isbn, edition = excluded.edition, language = excluded.language,
  exam = excluded.exam, format = excluded.format, price = excluded.price,
  original_price = excluded.original_price, discount_percent = excluded.discount_percent,
  rating = excluded.rating, reviews_count = excluded.reviews_count, badge = excluded.badge,
  badge_color = excluded.badge_color, image_url = excluded.image_url,
  description = excluded.description, highlights = excluded.highlights, pages = excluded.pages,
  publication = excluded.publication, binding = excluded.binding, in_stock = excluded.in_stock,
  is_bestseller = excluded.is_bestseller, is_new_release = excluded.is_new_release,
  is_featured = excluded.is_featured, show_in_hero = excluded.show_in_hero, is_active = excluded.is_active;
insert into public.books (id, slug, title, hindi_title, subtitle, author, category_id, isbn, edition, language, exam, format, price, original_price, discount_percent, rating, reviews_count, badge, badge_color, image_url, description, highlights, pages, publication, binding, in_stock, is_bestseller, is_new_release, is_featured, show_in_hero, is_active) values ('106', 'bns-20232024-106', 'भारतीय न्याय संहिता (BNS 2023/2024)', 'भारतीय न्याय संहिता - नवीन आपराधिक कानून', 'नवीन आपराधिक कानून, IPC तुलनात्मक चार्ट एवं महत्वपूर्ण धाराएं', 'Devanagari Law Faculty', 'civil-judge', '978-93-87654-17-5', 'Diglot First Edition 2025', 'Hindi-English Diglot', 'Judiciary & Civil Judge', 'Civil Judge', 499, 650, 23, 4.9, 1540, 'NEW LAW 2024', 'bg-purple-600 text-white', '/images/books/image-5.png', 'पुराने IPC (1860) और नए BNS (2023) का तुलनात्मक चार्ट, धारावार व्याख्या एवं केस लॉज सहित प्रामाणिक पुस्तक।', '["IPC vs BNS क्रॉस रेफरेंस टेबल","डिग्लॉट (हिंदी + अंग्रेजी आमने-सामने)","महत्वपूर्ण संशोधन व नए अपराध","सिविल जज एवं ADPO उपयोगी"]', 420, null, null, true, true, true, true, true, true) on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, hindi_title = excluded.hindi_title,
  subtitle = excluded.subtitle, author = excluded.author, category_id = excluded.category_id,
  isbn = excluded.isbn, edition = excluded.edition, language = excluded.language,
  exam = excluded.exam, format = excluded.format, price = excluded.price,
  original_price = excluded.original_price, discount_percent = excluded.discount_percent,
  rating = excluded.rating, reviews_count = excluded.reviews_count, badge = excluded.badge,
  badge_color = excluded.badge_color, image_url = excluded.image_url,
  description = excluded.description, highlights = excluded.highlights, pages = excluded.pages,
  publication = excluded.publication, binding = excluded.binding, in_stock = excluded.in_stock,
  is_bestseller = excluded.is_bestseller, is_new_release = excluded.is_new_release,
  is_featured = excluded.is_featured, show_in_hero = excluded.show_in_hero, is_active = excluded.is_active;
insert into public.books (id, slug, title, hindi_title, subtitle, author, category_id, isbn, edition, language, exam, format, price, original_price, discount_percent, rating, reviews_count, badge, badge_color, image_url, description, highlights, pages, publication, binding, in_stock, is_bestseller, is_new_release, is_featured, show_in_hero, is_active) values ('107', 'bnss-2023-107', 'भारतीय नागरिक सुरक्षा संहिता (BNSS 2023)', 'भारतीय नागरिक सुरक्षा संहिता', 'CrPC 1973 के स्थान पर लागू नवीन प्रक्रिया संहिता एवं केस लॉ', 'Justice R. P. Sharma (Retd.)', 'general-knowledge', '978-93-87654-18-2', '2025 Diglot Edition', 'Hindi-English Diglot', 'Judiciary & Legal Practice', 'General Knowledge', 549, 720, 24, 4.8, 960, 'MUST BUY', 'bg-emerald-600 text-white', '/images/books/image-8.png', 'जांच, गिरफ्तारी, जमानत, ट्रायल व इलेक्ट्रॉनिक साक्ष्य के नवीन प्रावधानों की सरल एवं स्पष्ट व्याख्या।', '["CrPC vs BNSS कंपैरिजन","ई-एफआईआर व फॉरेंसिक नियम","जमानत के नए नियम","प्रैक्टिसिंग एडवोकेट्स व स्टूडेंट्स हेतु"]', 480, null, null, true, false, true, true, false, true) on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, hindi_title = excluded.hindi_title,
  subtitle = excluded.subtitle, author = excluded.author, category_id = excluded.category_id,
  isbn = excluded.isbn, edition = excluded.edition, language = excluded.language,
  exam = excluded.exam, format = excluded.format, price = excluded.price,
  original_price = excluded.original_price, discount_percent = excluded.discount_percent,
  rating = excluded.rating, reviews_count = excluded.reviews_count, badge = excluded.badge,
  badge_color = excluded.badge_color, image_url = excluded.image_url,
  description = excluded.description, highlights = excluded.highlights, pages = excluded.pages,
  publication = excluded.publication, binding = excluded.binding, in_stock = excluded.in_stock,
  is_bestseller = excluded.is_bestseller, is_new_release = excluded.is_new_release,
  is_featured = excluded.is_featured, show_in_hero = excluded.show_in_hero, is_active = excluded.is_active;
insert into public.books (id, slug, title, hindi_title, subtitle, author, category_id, isbn, edition, language, exam, format, price, original_price, discount_percent, rating, reviews_count, badge, badge_color, image_url, description, highlights, pages, publication, binding, in_stock, is_bestseller, is_new_release, is_featured, show_in_hero, is_active) values ('108', 'bsa-2023-108', 'भारतीय साक्ष्य अधिनियम (BSA 2023)', 'भारतीय साक्ष्य अधिनियम - नवीन साक्ष्य विधि', 'Evidence Act 1872 बनाम BSA 2023 तुलनात्मक अध्ययन', 'Devanagari Law Faculty', 'general-knowledge', '978-93-87654-19-9', '2025 Edition', 'Hindi-English Diglot', 'Judicial Services Exam', 'General Knowledge', 399, 500, 20, 4.8, 712, 'NEW LAW', 'bg-purple-600 text-white', '/images/books/image-9.png', 'इलेक्ट्रॉनिक व डिजिटल रिकॉर्ड्स, सेकेंडरी एविडेंस और गवाहों के बयानों से संबंधित नए नियमों की संपूर्ण गाइड।', '["डिजिटल साक्ष्य की ग्राह्यता","IEA vs BSA धारा तुलना","सुप्रीम कोर्ट के नज़ीर","ऑब्जेक्टिव प्रैक्टिस क्वेश्चंस"]', 310, null, null, true, false, true, true, false, true) on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, hindi_title = excluded.hindi_title,
  subtitle = excluded.subtitle, author = excluded.author, category_id = excluded.category_id,
  isbn = excluded.isbn, edition = excluded.edition, language = excluded.language,
  exam = excluded.exam, format = excluded.format, price = excluded.price,
  original_price = excluded.original_price, discount_percent = excluded.discount_percent,
  rating = excluded.rating, reviews_count = excluded.reviews_count, badge = excluded.badge,
  badge_color = excluded.badge_color, image_url = excluded.image_url,
  description = excluded.description, highlights = excluded.highlights, pages = excluded.pages,
  publication = excluded.publication, binding = excluded.binding, in_stock = excluded.in_stock,
  is_bestseller = excluded.is_bestseller, is_new_release = excluded.is_new_release,
  is_featured = excluded.is_featured, show_in_hero = excluded.show_in_hero, is_active = excluded.is_active;
insert into public.books (id, slug, title, hindi_title, subtitle, author, category_id, isbn, edition, language, exam, format, price, original_price, discount_percent, rating, reviews_count, badge, badge_color, image_url, description, highlights, pages, publication, binding, in_stock, is_bestseller, is_new_release, is_featured, show_in_hero, is_active) values ('109', 'upsc-cse-prelims-master-guide-109', 'UPSC CSE Prelims Master Guide', 'संघ लोक सेवा आयोग प्रारंभिक परीक्षा मार्गदर्शिका', 'Comprehensive Prelims Strategy & Solved Papers in Hindi', 'Mr. Anand Mishra', 'general-knowledge', '978-93-87654-20-5', '15-Year Solved 2025', 'Hindi', 'UPSC CSE (Hindi Medium)', 'General Knowledge', 699, 899, 22, 4.6, 2103, 'UPSC SPECIAL', 'bg-indigo-600 text-white', '/images/books/upsc-master.png', 'हिंदी माध्यम के अभ्यर्थियों के लिए विगत 15 वर्षों के प्रश्नपत्रों का विषयवार एवं व्याख्यात्मक हल।', '["15 वर्षों के हल प्रश्न","ट्रेंड एनालिसिस 2011-2024","विषयवार वर्गीकरण","एलिमिनेशन तकनीक"]', 820, null, null, true, true, false, true, true, true) on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, hindi_title = excluded.hindi_title,
  subtitle = excluded.subtitle, author = excluded.author, category_id = excluded.category_id,
  isbn = excluded.isbn, edition = excluded.edition, language = excluded.language,
  exam = excluded.exam, format = excluded.format, price = excluded.price,
  original_price = excluded.original_price, discount_percent = excluded.discount_percent,
  rating = excluded.rating, reviews_count = excluded.reviews_count, badge = excluded.badge,
  badge_color = excluded.badge_color, image_url = excluded.image_url,
  description = excluded.description, highlights = excluded.highlights, pages = excluded.pages,
  publication = excluded.publication, binding = excluded.binding, in_stock = excluded.in_stock,
  is_bestseller = excluded.is_bestseller, is_new_release = excluded.is_new_release,
  is_featured = excluded.is_featured, show_in_hero = excluded.show_in_hero, is_active = excluded.is_active;
insert into public.books (id, slug, title, hindi_title, subtitle, author, category_id, isbn, edition, language, exam, format, price, original_price, discount_percent, rating, reviews_count, badge, badge_color, image_url, description, highlights, pages, publication, binding, in_stock, is_bestseller, is_new_release, is_featured, show_in_hero, is_active) values ('110', 'mp-civil-judge-entry-level-guide-110', 'MP Civil Judge Entry Level Guide', 'मध्य प्रदेश सिविल जज प्रारंभिक एवं मुख्य परीक्षा', '12 प्रमुख एवं स्थानीय विधियों का संपूर्ण संकलन व मॉडल पेपर्स', 'Justice R. P. Sharma (Retd.)', 'mppsc', '978-93-87654-21-2', '2025 Updated Edition', 'Hindi', 'MP Civil Judge Exam', 'MPPSC', 749, 999, 25, 5, 1420, 'TOPPER CHOICE', 'bg-amber-600 text-white', '/images/books/image-11.png', 'MP Civil Judge Prelims & Mains के सभी 12 विषयों का सारगर्भित अध्ययन, स्थानीय अधिनियम व जजमेंट राइटिंग।', '["MP Land Revenue Code शामिल","MP Accommodation Control Act","जजमेंट राइटिंग फ्रेमवर्क","5 मॉक टेस्ट पेपर्स"]', 860, null, null, true, true, false, true, true, true) on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, hindi_title = excluded.hindi_title,
  subtitle = excluded.subtitle, author = excluded.author, category_id = excluded.category_id,
  isbn = excluded.isbn, edition = excluded.edition, language = excluded.language,
  exam = excluded.exam, format = excluded.format, price = excluded.price,
  original_price = excluded.original_price, discount_percent = excluded.discount_percent,
  rating = excluded.rating, reviews_count = excluded.reviews_count, badge = excluded.badge,
  badge_color = excluded.badge_color, image_url = excluded.image_url,
  description = excluded.description, highlights = excluded.highlights, pages = excluded.pages,
  publication = excluded.publication, binding = excluded.binding, in_stock = excluded.in_stock,
  is_bestseller = excluded.is_bestseller, is_new_release = excluded.is_new_release,
  is_featured = excluded.is_featured, show_in_hero = excluded.show_in_hero, is_active = excluded.is_active;
insert into public.books (id, slug, title, hindi_title, subtitle, author, category_id, isbn, edition, language, exam, format, price, original_price, discount_percent, rating, reviews_count, badge, badge_color, image_url, description, highlights, pages, publication, binding, in_stock, is_bestseller, is_new_release, is_featured, show_in_hero, is_active) values ('111', 'judicial-judgment-writing-issue-framing-111', 'Judicial Judgment Writing & Issue Framing', 'निर्णय लेखन एवं विवादक विरचना', 'सिविल एवं आपराधिक निर्णय लेखन का संपूर्ण प्रारूप एवं हल उदाहरण', 'Adv. Alok Tiwari', 'mppsc', '978-93-87654-22-9', '2025 Edition', 'Hindi', 'Judicial Services', 'MPPSC', 320, 450, 29, 4.9, 840, 'MAINS SPECIAL', 'bg-teal-600 text-white', '/images/books/image-12.png', 'सिविल व क्रिमिनल जजमेंट राइटिंग में 100 में से 75+ अंक प्राप्त करने की व्यावहारिक गाइड एवं टॉपर्स की कॉपीज।', '["30+ सिविल हल निर्णय","25+ क्रिमिनल हल निर्णय","चार्ज फ्रेमिंग तकनीक","मार्किंग स्कीम विश्लेषण"]', 280, null, null, true, false, true, false, false, true) on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, hindi_title = excluded.hindi_title,
  subtitle = excluded.subtitle, author = excluded.author, category_id = excluded.category_id,
  isbn = excluded.isbn, edition = excluded.edition, language = excluded.language,
  exam = excluded.exam, format = excluded.format, price = excluded.price,
  original_price = excluded.original_price, discount_percent = excluded.discount_percent,
  rating = excluded.rating, reviews_count = excluded.reviews_count, badge = excluded.badge,
  badge_color = excluded.badge_color, image_url = excluded.image_url,
  description = excluded.description, highlights = excluded.highlights, pages = excluded.pages,
  publication = excluded.publication, binding = excluded.binding, in_stock = excluded.in_stock,
  is_bestseller = excluded.is_bestseller, is_new_release = excluded.is_new_release,
  is_featured = excluded.is_featured, show_in_hero = excluded.show_in_hero, is_active = excluded.is_active;
insert into public.books (id, slug, title, hindi_title, subtitle, author, category_id, isbn, edition, language, exam, format, price, original_price, discount_percent, rating, reviews_count, badge, badge_color, image_url, description, highlights, pages, publication, binding, in_stock, is_bestseller, is_new_release, is_featured, show_in_hero, is_active) values ('112', 'mp-police-si-patwari-special-guide-112', 'MP Police SI & Patwari Special Guide', 'मध्य प्रदेश सब-इंस्पेक्टर एवं पटवारी भर्ती परीक्षा', 'हिंदी, सामान्य ज्ञान, गणित एवं तार्किक क्षमता संपूर्ण गाइड', 'Mr. Mayank Jagdish Sharma', 'mppsc', '978-93-87654-23-6', '2025 Latest', 'Hindi', 'MP Police SI / Patwari', 'MPPSC', 480, 650, 26, 4.7, 1670, 'SI SPECIAL', 'bg-red-600 text-white', '/images/books/image-2.png', '70 नंबर की विशेष हिंदी एवं सामान्य अध्ययन के साथ 3000+ अभ्यास प्रश्न।', '["70 अंक की विशेष हिंदी","MP GK व करंट अफेयर्स","विगत वर्षों के हल प्रश्न","3 फ्री ऑनलाइन मॉक टेस्ट"]', 580, null, null, true, true, false, true, true, true) on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, hindi_title = excluded.hindi_title,
  subtitle = excluded.subtitle, author = excluded.author, category_id = excluded.category_id,
  isbn = excluded.isbn, edition = excluded.edition, language = excluded.language,
  exam = excluded.exam, format = excluded.format, price = excluded.price,
  original_price = excluded.original_price, discount_percent = excluded.discount_percent,
  rating = excluded.rating, reviews_count = excluded.reviews_count, badge = excluded.badge,
  badge_color = excluded.badge_color, image_url = excluded.image_url,
  description = excluded.description, highlights = excluded.highlights, pages = excluded.pages,
  publication = excluded.publication, binding = excluded.binding, in_stock = excluded.in_stock,
  is_bestseller = excluded.is_bestseller, is_new_release = excluded.is_new_release,
  is_featured = excluded.is_featured, show_in_hero = excluded.show_in_hero, is_active = excluded.is_active;
insert into public.books (id, slug, title, hindi_title, subtitle, author, category_id, isbn, edition, language, exam, format, price, original_price, discount_percent, rating, reviews_count, badge, badge_color, image_url, description, highlights, pages, publication, binding, in_stock, is_bestseller, is_new_release, is_featured, show_in_hero, is_active) values ('113', 'mppsc-mains-gs-paper-3-113', 'MPPSC Mains GS Paper 3 (विज्ञान एवं तकनीकी)', 'मुख्य परीक्षा GS 3 - विज्ञान, पर्यावरण एवं अर्थव्यवस्था', 'नवीन पाठ्यक्रम अनुरूप 10 इकाइयों के टू-द-पॉइंट नोट्स', 'Dr. V. K. Singh & Faculty', 'upsc', '978-93-87654-24-3', '2025 Edition', 'Hindi', 'MPPSC Mains GS-3', 'UPSC', 520, 699, 26, 4.8, 920, 'MAINS GS-3', 'bg-blue-600 text-white', '/images/books/image-10.png', 'Physics, Chemistry, Biology, Computer, Maths, Ayush, Environment और भारतीय अर्थव्यवस्था का संपूर्ण संकलन।', '["3, 5 व 11 मार्कर प्रारूप","डायग्राम आधारित उत्तर शैली","नवीनतम आंकड़े व बजट 2025","यूनिटवार मॉडल प्रश्नोत्तर"]', 490, null, null, true, false, true, true, false, true) on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, hindi_title = excluded.hindi_title,
  subtitle = excluded.subtitle, author = excluded.author, category_id = excluded.category_id,
  isbn = excluded.isbn, edition = excluded.edition, language = excluded.language,
  exam = excluded.exam, format = excluded.format, price = excluded.price,
  original_price = excluded.original_price, discount_percent = excluded.discount_percent,
  rating = excluded.rating, reviews_count = excluded.reviews_count, badge = excluded.badge,
  badge_color = excluded.badge_color, image_url = excluded.image_url,
  description = excluded.description, highlights = excluded.highlights, pages = excluded.pages,
  publication = excluded.publication, binding = excluded.binding, in_stock = excluded.in_stock,
  is_bestseller = excluded.is_bestseller, is_new_release = excluded.is_new_release,
  is_featured = excluded.is_featured, show_in_hero = excluded.show_in_hero, is_active = excluded.is_active;
insert into public.books (id, slug, title, hindi_title, subtitle, author, category_id, isbn, edition, language, exam, format, price, original_price, discount_percent, rating, reviews_count, badge, badge_color, image_url, description, highlights, pages, publication, binding, in_stock, is_bestseller, is_new_release, is_featured, show_in_hero, is_active) values ('114', 'mppsc-mains-gs-paper-2-114', 'MPPSC Mains GS Paper 2 (संविधान, शासन व समाजशास्त्र)', 'मुख्य परीक्षा GS 2 - संविधान, शासन एवं समाजशास्त्र', 'भारतीय राजव्यवस्था, लोक प्रशासन एवं सामाजिक मुद्दे', 'Mr. Shubham Gupta', 'upsc', '978-93-87654-25-0', '2025 Edition', 'Hindi', 'MPPSC Mains GS-2', 'UPSC', 499, 650, 23, 4.7, 650, 'GS-2 SPECIAL', 'bg-indigo-600 text-white', '/images/books/image-3.png', 'भारतीय संविधान के संशोधन, पंचायती राज, सामाजिक विधान, स्वास्थ्य, शिक्षा एवं मानवाधिकार।', '["संविधान के महत्वपूर्ण अनुच्छेद","लोक प्रशासन विचार","समाजशास्त्र की मौलिक अवधारणाएं","मॉडल उत्तर लेखन"]', 450, null, null, true, false, false, false, false, true) on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, hindi_title = excluded.hindi_title,
  subtitle = excluded.subtitle, author = excluded.author, category_id = excluded.category_id,
  isbn = excluded.isbn, edition = excluded.edition, language = excluded.language,
  exam = excluded.exam, format = excluded.format, price = excluded.price,
  original_price = excluded.original_price, discount_percent = excluded.discount_percent,
  rating = excluded.rating, reviews_count = excluded.reviews_count, badge = excluded.badge,
  badge_color = excluded.badge_color, image_url = excluded.image_url,
  description = excluded.description, highlights = excluded.highlights, pages = excluded.pages,
  publication = excluded.publication, binding = excluded.binding, in_stock = excluded.in_stock,
  is_bestseller = excluded.is_bestseller, is_new_release = excluded.is_new_release,
  is_featured = excluded.is_featured, show_in_hero = excluded.show_in_hero, is_active = excluded.is_active;
insert into public.books (id, slug, title, hindi_title, subtitle, author, category_id, isbn, edition, language, exam, format, price, original_price, discount_percent, rating, reviews_count, badge, badge_color, image_url, description, highlights, pages, publication, binding, in_stock, is_bestseller, is_new_release, is_featured, show_in_hero, is_active) values ('115', 'adpo-complete-examination-course-115', 'ADPO Complete Examination Course (अभियोजन अधिकारी)', 'सहायक जिला लोक अभियोजन अधिकारी (ADPO) मार्गदर्शिका', '28 विशेष एवं स्थानीय अधिनियम तथा सामान्य ज्ञान', 'Devanagari Law Faculty', 'upsc', '978-93-87654-26-7', '2025 Edition', 'Hindi', 'ADPO Exam', 'UPSC', 649, 850, 24, 4.9, 1105, 'ADPO 2025', 'bg-purple-600 text-white', '/images/books/image-8.png', 'ADPO परीक्षा हेतु आवश्यक 28 लघु व स्थानीय कानूनों के विस्तृत नोट्स और विगत वर्षों के प्रश्न।', '["28 लघु अधिनियमों का समावेश","धारावार वस्तुनिष्ठ प्रश्न","MP विशेष सामान्य ज्ञान","अंतिम समय पुनरीक्षण नोट्स"]', 640, null, null, true, true, false, true, true, true) on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, hindi_title = excluded.hindi_title,
  subtitle = excluded.subtitle, author = excluded.author, category_id = excluded.category_id,
  isbn = excluded.isbn, edition = excluded.edition, language = excluded.language,
  exam = excluded.exam, format = excluded.format, price = excluded.price,
  original_price = excluded.original_price, discount_percent = excluded.discount_percent,
  rating = excluded.rating, reviews_count = excluded.reviews_count, badge = excluded.badge,
  badge_color = excluded.badge_color, image_url = excluded.image_url,
  description = excluded.description, highlights = excluded.highlights, pages = excluded.pages,
  publication = excluded.publication, binding = excluded.binding, in_stock = excluded.in_stock,
  is_bestseller = excluded.is_bestseller, is_new_release = excluded.is_new_release,
  is_featured = excluded.is_featured, show_in_hero = excluded.show_in_hero, is_active = excluded.is_active;
insert into public.books (id, slug, title, hindi_title, subtitle, author, category_id, isbn, edition, language, exam, format, price, original_price, discount_percent, rating, reviews_count, badge, badge_color, image_url, description, highlights, pages, publication, binding, in_stock, is_bestseller, is_new_release, is_featured, show_in_hero, is_active) values ('116', '-116', 'मध्य प्रदेश इतिहास, संस्कृति एवं साहित्य', 'मध्य प्रदेश का इतिहास, जनजातीय संस्कृति एवं लोक साहित्य', 'प्राचीन, मध्यकालीन, आधुनिक MP एवं स्वतंत्रता संग्राम में योगदान', 'Mr. Mayank Jagdish Sharma', 'literature', '978-93-87654-27-4', '2025 Color Edition', 'Hindi', 'MPPSC Prelims & Mains', 'Literature', 349, 480, 27, 4.9, 1430, 'BESTSELLER', 'bg-red-600 text-white', '/images/books/image-4.png', 'MPPSC के नवीन यूनिट 1 एवं 10 के अनुसार गोंडवाना, बुंदेलखंड, बघेलखंड, मालवा एवं निमाड़ का प्रामाणिक इतिहास।', '["गोंड, भील, बैगा जनजाति इतिहास","MP के स्वतंत्रता सेनानी","लोक नृत्य, नाट्य व चित्रकला","प्रमुख रियासतें एवं स्थापत्य"]', 390, null, null, true, true, false, true, true, true) on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, hindi_title = excluded.hindi_title,
  subtitle = excluded.subtitle, author = excluded.author, category_id = excluded.category_id,
  isbn = excluded.isbn, edition = excluded.edition, language = excluded.language,
  exam = excluded.exam, format = excluded.format, price = excluded.price,
  original_price = excluded.original_price, discount_percent = excluded.discount_percent,
  rating = excluded.rating, reviews_count = excluded.reviews_count, badge = excluded.badge,
  badge_color = excluded.badge_color, image_url = excluded.image_url,
  description = excluded.description, highlights = excluded.highlights, pages = excluded.pages,
  publication = excluded.publication, binding = excluded.binding, in_stock = excluded.in_stock,
  is_bestseller = excluded.is_bestseller, is_new_release = excluded.is_new_release,
  is_featured = excluded.is_featured, show_in_hero = excluded.show_in_hero, is_active = excluded.is_active;
insert into public.books (id, slug, title, hindi_title, subtitle, author, category_id, isbn, edition, language, exam, format, price, original_price, discount_percent, rating, reviews_count, badge, badge_color, image_url, description, highlights, pages, publication, binding, in_stock, is_bestseller, is_new_release, is_featured, show_in_hero, is_active) values ('117', 'samanya-hindi-evam-vyakaran-117', 'Samanya Hindi Evam Vyakaran', 'सामान्य हिन्दी एवं व्याकरण', 'मध्य प्रदेश लोक सेवा आयोग एवं अन्य राज्य परीक्षाओं हेतु संपूर्ण मानक पुस्तक', 'Mr. Mayank Jagdish Sharma', 'literature', '978-93-87654-12-0', '3rd Edition 2025-26', 'Hindi', 'MPPSC State Services', 'Literature', 900, 1000, 10, 4.9, 1876, 'BESTSELLER', 'bg-red-600 text-white', '/images/books/image-2.png', 'MPPSC Mains Paper 5 एवं SI, Patwari परीक्षाओं के लिए नवीनतम पाठ्यक्रम के अनुसार प्रामाणिक व्याकरण, शब्द सामर्थ्य एवं प्रारूप लेखन।', '["नवीनतम सिलेबस 2025 अनुरूप","विगत 10 वर्षों के हल प्रश्न","5000+ वस्तुनिष्ठ अभ्यास प्रश्न","प्रारूप लेखन व संक्षेपण"]', 680, 'Dnyanagari Prakashan', 'Paperback', true, true, false, true, false, true) on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, hindi_title = excluded.hindi_title,
  subtitle = excluded.subtitle, author = excluded.author, category_id = excluded.category_id,
  isbn = excluded.isbn, edition = excluded.edition, language = excluded.language,
  exam = excluded.exam, format = excluded.format, price = excluded.price,
  original_price = excluded.original_price, discount_percent = excluded.discount_percent,
  rating = excluded.rating, reviews_count = excluded.reviews_count, badge = excluded.badge,
  badge_color = excluded.badge_color, image_url = excluded.image_url,
  description = excluded.description, highlights = excluded.highlights, pages = excluded.pages,
  publication = excluded.publication, binding = excluded.binding, in_stock = excluded.in_stock,
  is_bestseller = excluded.is_bestseller, is_new_release = excluded.is_new_release,
  is_featured = excluded.is_featured, show_in_hero = excluded.show_in_hero, is_active = excluded.is_active;
insert into public.books (id, slug, title, hindi_title, subtitle, author, category_id, isbn, edition, language, exam, format, price, original_price, discount_percent, rating, reviews_count, badge, badge_color, image_url, description, highlights, pages, publication, binding, in_stock, is_bestseller, is_new_release, is_featured, show_in_hero, is_active) values ('118', 'nibandh-sanhita-118', 'Nibandh Sanhita', 'निबंध संहिता एवं प्रारूप लेखन', 'मुख्य परीक्षा विशेषांक, समसामयिक मुद्दे एवं प्रारूप चंद्रिका', 'Mr. Mayank Jagdish Sharma', 'literature', '978-93-12345-678-9', '2025 (Latest Edition)', 'Hindi', 'MPPSC Prarambhik Pariksha', 'Literature', 249, 349, 29, 4.9, 728, 'Bestseller', 'bg-[#C61821] text-white', '/images/books/image-3.png', '''निबंध संहिता'' MPPSC प्रारंभिक एवं मुख्य परीक्षा के लिए निबंध लेखन की एक अत्यंत उपयोगी पुस्तक है। इसमें 250+ निबंधों का संग्रह है जो विभिन्न विषयों को कवर करते हैं। पुस्तक में समसामयिक घटनाओं, आंकड़े और तथ्यों को शामिल किया गया है जो आपके निबंध को और अधिक प्रभावशाली बनाते हैं।', '["250+ निबंध संग्रह","अद्यतन आंकड़े","समसामयिक विषय","सरल व प्रभावशाली लेखन","परीक्षा दृष्टिकोण","परीक्षा उपयोगी संग्रह"]', 456, 'Dnyanagari Prakashan', 'Paperback', true, true, false, true, false, true) on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, hindi_title = excluded.hindi_title,
  subtitle = excluded.subtitle, author = excluded.author, category_id = excluded.category_id,
  isbn = excluded.isbn, edition = excluded.edition, language = excluded.language,
  exam = excluded.exam, format = excluded.format, price = excluded.price,
  original_price = excluded.original_price, discount_percent = excluded.discount_percent,
  rating = excluded.rating, reviews_count = excluded.reviews_count, badge = excluded.badge,
  badge_color = excluded.badge_color, image_url = excluded.image_url,
  description = excluded.description, highlights = excluded.highlights, pages = excluded.pages,
  publication = excluded.publication, binding = excluded.binding, in_stock = excluded.in_stock,
  is_bestseller = excluded.is_bestseller, is_new_release = excluded.is_new_release,
  is_featured = excluded.is_featured, show_in_hero = excluded.show_in_hero, is_active = excluded.is_active;
insert into public.books (id, slug, title, hindi_title, subtitle, author, category_id, isbn, edition, language, exam, format, price, original_price, discount_percent, rating, reviews_count, badge, badge_color, image_url, description, highlights, pages, publication, binding, in_stock, is_bestseller, is_new_release, is_featured, show_in_hero, is_active) values ('119', '-119', 'आधुनिक हिन्दी व्याकरण', 'आधुनिक हिन्दी व्याकरण एवं रचना', 'व्याकरण, रचना, मानक शब्दावली एवं भाषा चिंतन', 'Devanagari Publications', 'other', '978-93-87654-14-4', 'Standard Edition 2025', 'Hindi', 'MPPSC & SI Exams', 'Other', 449, 599, 25, 4.8, 1284, 'STANDARD', 'bg-emerald-600 text-white', '/images/books/adhunik-hindi.png', 'व्याकरण के समस्त नियमों, अपवादों एवं व्यावहारिक उदाहरणों का सरल एवं वैज्ञानिक प्रस्तुतीकरण।', '["संपूर्ण वर्ण विचार व संधि","समास व प्रत्यय विशेष","वाक्य शुद्धि व मुहावरे","अध्यापन एवं प्रतियोगी दोनों हेतु उपयुक्त"]', 512, null, null, true, true, false, true, false, true) on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, hindi_title = excluded.hindi_title,
  subtitle = excluded.subtitle, author = excluded.author, category_id = excluded.category_id,
  isbn = excluded.isbn, edition = excluded.edition, language = excluded.language,
  exam = excluded.exam, format = excluded.format, price = excluded.price,
  original_price = excluded.original_price, discount_percent = excluded.discount_percent,
  rating = excluded.rating, reviews_count = excluded.reviews_count, badge = excluded.badge,
  badge_color = excluded.badge_color, image_url = excluded.image_url,
  description = excluded.description, highlights = excluded.highlights, pages = excluded.pages,
  publication = excluded.publication, binding = excluded.binding, in_stock = excluded.in_stock,
  is_bestseller = excluded.is_bestseller, is_new_release = excluded.is_new_release,
  is_featured = excluded.is_featured, show_in_hero = excluded.show_in_hero, is_active = excluded.is_active;
insert into public.books (id, slug, title, hindi_title, subtitle, author, category_id, isbn, edition, language, exam, format, price, original_price, discount_percent, rating, reviews_count, badge, badge_color, image_url, description, highlights, pages, publication, binding, in_stock, is_bestseller, is_new_release, is_featured, show_in_hero, is_active) values ('120', 'mppsc-gs-paper-1-120', 'MPPSC प्रारंभिक परीक्षा GS Paper 1', 'मध्य प्रदेश लोक सेवा आयोग सामान्य अध्ययन', 'प्रथम प्रश्न पत्र - 10 इकाइयों का संपूर्ण विश्लेषणात्मक संकलन', 'Mr. Shubham Gupta', 'other', '978-93-87654-15-1', '2025 New Syllabus', 'Hindi', 'MPPSC Prelims', 'Other', 599, 799, 25, 4.7, 831, '2025 EDITION', 'bg-blue-600 text-white', '/images/books/image-10.png', 'MPPSC प्रारंभिक परीक्षा के बदले हुए 10 यूनिट पाठ्यक्रम का सटीक, तथ्यपरक एवं मानचित्र आधारित अध्ययन।', '["10 इकाइयों का पूर्ण समावेश","नवीनतम जनजाति व MP इतिहास","इन्फोग्राफिक्स व फ्लोचार्ट्स","प्रत्येक यूनिट के बाद 100 MCQs"]', 720, null, null, true, false, true, true, false, true) on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, hindi_title = excluded.hindi_title,
  subtitle = excluded.subtitle, author = excluded.author, category_id = excluded.category_id,
  isbn = excluded.isbn, edition = excluded.edition, language = excluded.language,
  exam = excluded.exam, format = excluded.format, price = excluded.price,
  original_price = excluded.original_price, discount_percent = excluded.discount_percent,
  rating = excluded.rating, reviews_count = excluded.reviews_count, badge = excluded.badge,
  badge_color = excluded.badge_color, image_url = excluded.image_url,
  description = excluded.description, highlights = excluded.highlights, pages = excluded.pages,
  publication = excluded.publication, binding = excluded.binding, in_stock = excluded.in_stock,
  is_bestseller = excluded.is_bestseller, is_new_release = excluded.is_new_release,
  is_featured = excluded.is_featured, show_in_hero = excluded.show_in_hero, is_active = excluded.is_active;
insert into public.books (id, slug, title, hindi_title, subtitle, author, category_id, isbn, edition, language, exam, format, price, original_price, discount_percent, rating, reviews_count, badge, badge_color, image_url, description, highlights, pages, publication, binding, in_stock, is_bestseller, is_new_release, is_featured, show_in_hero, is_active) values ('121', 'mp-gk-121', 'मध्य प्रदेश सामान्य ज्ञान (MP GK)', 'मध्य प्रदेश सामान्य ज्ञान मानचित्र संकलन', 'मानचित्र, सारणी एवं तथ्यात्मक संपूर्ण संकलन 2025-26', 'Mr. Mayank Jagdish Sharma', 'other', '978-93-87654-16-8', '2025-26 Color Edition', 'Hindi', 'MPPSC & State Exams', 'Other', 389, 550, 29, 4.9, 2890, 'TOP SELLER', 'bg-red-600 text-white', '/images/books/image-4.png', 'मध्य प्रदेश का इतिहास, कला, संस्कृति, भूगोल, अर्थव्यवस्था एवं प्रमुख विभूतियों का सचित्र विवरण।', '["60+ रंगीन मानचित्र","जनजातीय कला व स्वतंत्रता सेनानी","नवीनतम जिले व प्रशासनिक आंकड़े","1000+ वन-लाइनर फैक्ट्स"]', 460, null, null, true, true, false, true, false, true) on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, hindi_title = excluded.hindi_title,
  subtitle = excluded.subtitle, author = excluded.author, category_id = excluded.category_id,
  isbn = excluded.isbn, edition = excluded.edition, language = excluded.language,
  exam = excluded.exam, format = excluded.format, price = excluded.price,
  original_price = excluded.original_price, discount_percent = excluded.discount_percent,
  rating = excluded.rating, reviews_count = excluded.reviews_count, badge = excluded.badge,
  badge_color = excluded.badge_color, image_url = excluded.image_url,
  description = excluded.description, highlights = excluded.highlights, pages = excluded.pages,
  publication = excluded.publication, binding = excluded.binding, in_stock = excluded.in_stock,
  is_bestseller = excluded.is_bestseller, is_new_release = excluded.is_new_release,
  is_featured = excluded.is_featured, show_in_hero = excluded.show_in_hero, is_active = excluded.is_active;

-- reviews (2 seeded per book; alter is idempotent for existing DBs)
alter table public.reviews add column if not exists reviewer_name text;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-101-1', '101', 5, 'Samanya Hindi Evam Vyakaran की भाषा बहुत सरल और परीक्षा-उपयोगी है। पूरा सिलेबस समय पर कवर हो जाता है।', 'राहुल शर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-101-2', '101', 4, 'सामग्री अच्छी है और प्रश्न विगत वर्षों पर आधारित हैं। पैकेजिंग व डिलीवरी भी बढ़िया।', 'प्रिया वर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-102-1', '102', 5, 'Nibandh Sanhita की भाषा बहुत सरल और परीक्षा-उपयोगी है। पूरा सिलेबस समय पर कवर हो जाता है।', 'राहुल शर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-102-2', '102', 4, 'सामग्री अच्छी है और प्रश्न विगत वर्षों पर आधारित हैं। पैकेजिंग व डिलीवरी भी बढ़िया।', 'प्रिया वर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-103-1', '103', 5, 'आधुनिक हिन्दी व्याकरण की भाषा बहुत सरल और परीक्षा-उपयोगी है। पूरा सिलेबस समय पर कवर हो जाता है।', 'राहुल शर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-103-2', '103', 4, 'सामग्री अच्छी है और प्रश्न विगत वर्षों पर आधारित हैं। पैकेजिंग व डिलीवरी भी बढ़िया।', 'प्रिया वर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-104-1', '104', 5, 'MPPSC प्रारंभिक परीक्षा GS Paper 1 की भाषा बहुत सरल और परीक्षा-उपयोगी है। पूरा सिलेबस समय पर कवर हो जाता है।', 'राहुल शर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-104-2', '104', 4, 'सामग्री अच्छी है और प्रश्न विगत वर्षों पर आधारित हैं। पैकेजिंग व डिलीवरी भी बढ़िया।', 'प्रिया वर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-105-1', '105', 5, 'मध्य प्रदेश सामान्य ज्ञान (MP GK) की भाषा बहुत सरल और परीक्षा-उपयोगी है। पूरा सिलेबस समय पर कवर हो जाता है।', 'राहुल शर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-105-2', '105', 4, 'सामग्री अच्छी है और प्रश्न विगत वर्षों पर आधारित हैं। पैकेजिंग व डिलीवरी भी बढ़िया।', 'प्रिया वर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-106-1', '106', 5, 'भारतीय न्याय संहिता (BNS 2023/2024) की भाषा बहुत सरल और परीक्षा-उपयोगी है। पूरा सिलेबस समय पर कवर हो जाता है।', 'राहुल शर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-106-2', '106', 4, 'सामग्री अच्छी है और प्रश्न विगत वर्षों पर आधारित हैं। पैकेजिंग व डिलीवरी भी बढ़िया।', 'प्रिया वर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-107-1', '107', 5, 'भारतीय नागरिक सुरक्षा संहिता (BNSS 2023) की भाषा बहुत सरल और परीक्षा-उपयोगी है। पूरा सिलेबस समय पर कवर हो जाता है।', 'राहुल शर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-107-2', '107', 4, 'सामग्री अच्छी है और प्रश्न विगत वर्षों पर आधारित हैं। पैकेजिंग व डिलीवरी भी बढ़िया।', 'प्रिया वर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-108-1', '108', 5, 'भारतीय साक्ष्य अधिनियम (BSA 2023) की भाषा बहुत सरल और परीक्षा-उपयोगी है। पूरा सिलेबस समय पर कवर हो जाता है।', 'राहुल शर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-108-2', '108', 4, 'सामग्री अच्छी है और प्रश्न विगत वर्षों पर आधारित हैं। पैकेजिंग व डिलीवरी भी बढ़िया।', 'प्रिया वर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-109-1', '109', 5, 'UPSC CSE Prelims Master Guide की भाषा बहुत सरल और परीक्षा-उपयोगी है। पूरा सिलेबस समय पर कवर हो जाता है।', 'राहुल शर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-109-2', '109', 4, 'सामग्री अच्छी है और प्रश्न विगत वर्षों पर आधारित हैं। पैकेजिंग व डिलीवरी भी बढ़िया।', 'प्रिया वर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-110-1', '110', 5, 'MP Civil Judge Entry Level Guide की भाषा बहुत सरल और परीक्षा-उपयोगी है। पूरा सिलेबस समय पर कवर हो जाता है।', 'राहुल शर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-110-2', '110', 4, 'सामग्री अच्छी है और प्रश्न विगत वर्षों पर आधारित हैं। पैकेजिंग व डिलीवरी भी बढ़िया।', 'प्रिया वर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-111-1', '111', 5, 'Judicial Judgment Writing & Issue Framing की भाषा बहुत सरल और परीक्षा-उपयोगी है। पूरा सिलेबस समय पर कवर हो जाता है।', 'राहुल शर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-111-2', '111', 4, 'सामग्री अच्छी है और प्रश्न विगत वर्षों पर आधारित हैं। पैकेजिंग व डिलीवरी भी बढ़िया।', 'प्रिया वर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-112-1', '112', 5, 'MP Police SI & Patwari Special Guide की भाषा बहुत सरल और परीक्षा-उपयोगी है। पूरा सिलेबस समय पर कवर हो जाता है।', 'राहुल शर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-112-2', '112', 4, 'सामग्री अच्छी है और प्रश्न विगत वर्षों पर आधारित हैं। पैकेजिंग व डिलीवरी भी बढ़िया।', 'प्रिया वर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-113-1', '113', 5, 'MPPSC Mains GS Paper 3 (विज्ञान एवं तकनीकी) की भाषा बहुत सरल और परीक्षा-उपयोगी है। पूरा सिलेबस समय पर कवर हो जाता है।', 'राहुल शर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-113-2', '113', 4, 'सामग्री अच्छी है और प्रश्न विगत वर्षों पर आधारित हैं। पैकेजिंग व डिलीवरी भी बढ़िया।', 'प्रिया वर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-114-1', '114', 5, 'MPPSC Mains GS Paper 2 (संविधान, शासन व समाजशास्त्र) की भाषा बहुत सरल और परीक्षा-उपयोगी है। पूरा सिलेबस समय पर कवर हो जाता है।', 'राहुल शर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-114-2', '114', 4, 'सामग्री अच्छी है और प्रश्न विगत वर्षों पर आधारित हैं। पैकेजिंग व डिलीवरी भी बढ़िया।', 'प्रिया वर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-115-1', '115', 5, 'ADPO Complete Examination Course (अभियोजन अधिकारी) की भाषा बहुत सरल और परीक्षा-उपयोगी है। पूरा सिलेबस समय पर कवर हो जाता है।', 'राहुल शर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-115-2', '115', 4, 'सामग्री अच्छी है और प्रश्न विगत वर्षों पर आधारित हैं। पैकेजिंग व डिलीवरी भी बढ़िया।', 'प्रिया वर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-116-1', '116', 5, 'मध्य प्रदेश इतिहास, संस्कृति एवं साहित्य की भाषा बहुत सरल और परीक्षा-उपयोगी है। पूरा सिलेबस समय पर कवर हो जाता है।', 'राहुल शर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-116-2', '116', 4, 'सामग्री अच्छी है और प्रश्न विगत वर्षों पर आधारित हैं। पैकेजिंग व डिलीवरी भी बढ़िया।', 'प्रिया वर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-117-1', '117', 5, 'Samanya Hindi Evam Vyakaran की भाषा बहुत सरल और परीक्षा-उपयोगी है। पूरा सिलेबस समय पर कवर हो जाता है।', 'राहुल शर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-117-2', '117', 4, 'सामग्री अच्छी है और प्रश्न विगत वर्षों पर आधारित हैं। पैकेजिंग व डिलीवरी भी बढ़िया।', 'प्रिया वर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-118-1', '118', 5, 'Nibandh Sanhita की भाषा बहुत सरल और परीक्षा-उपयोगी है। पूरा सिलेबस समय पर कवर हो जाता है।', 'राहुल शर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-118-2', '118', 4, 'सामग्री अच्छी है और प्रश्न विगत वर्षों पर आधारित हैं। पैकेजिंग व डिलीवरी भी बढ़िया।', 'प्रिया वर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-119-1', '119', 5, 'आधुनिक हिन्दी व्याकरण की भाषा बहुत सरल और परीक्षा-उपयोगी है। पूरा सिलेबस समय पर कवर हो जाता है।', 'राहुल शर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-119-2', '119', 4, 'सामग्री अच्छी है और प्रश्न विगत वर्षों पर आधारित हैं। पैकेजिंग व डिलीवरी भी बढ़िया।', 'प्रिया वर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-120-1', '120', 5, 'MPPSC प्रारंभिक परीक्षा GS Paper 1 की भाषा बहुत सरल और परीक्षा-उपयोगी है। पूरा सिलेबस समय पर कवर हो जाता है।', 'राहुल शर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-120-2', '120', 4, 'सामग्री अच्छी है और प्रश्न विगत वर्षों पर आधारित हैं। पैकेजिंग व डिलीवरी भी बढ़िया।', 'प्रिया वर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-121-1', '121', 5, 'मध्य प्रदेश सामान्य ज्ञान (MP GK) की भाषा बहुत सरल और परीक्षा-उपयोगी है। पूरा सिलेबस समय पर कवर हो जाता है।', 'राहुल शर्मा', true) on conflict (id) do nothing;
insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values ('rev-121-2', '121', 4, 'सामग्री अच्छी है और प्रश्न विगत वर्षों पर आधारित हैं। पैकेजिंग व डिलीवरी भी बढ़िया।', 'प्रिया वर्मा', true) on conflict (id) do nothing;

-- inquiries
insert into public.inquiries (id, name, email, phone, message, status) values ('inq-1', 'Rahul Sharma', 'rahul@example.com', '+91 98765 43210', 'Is the MPPSC Mains GS Paper 3 book available in Hindi-English diglot?', 'unread') on conflict (id) do nothing;
insert into public.inquiries (id, name, email, phone, message, status) values ('inq-2', 'Priya Verma', 'priya@example.com', '+91 91234 56789', 'Do you offer bulk discounts for coaching institutes?', 'unread') on conflict (id) do nothing;
insert into public.inquiries (id, name, email, phone, message, status) values ('inq-3', 'Amit Singh', 'amit@example.com', '+91 99887 76655', 'When will the 2026 edition of MP GK be released?', 'unread') on conflict (id) do nothing;

-- announcements
insert into public.announcements (id, text, is_active) values ('ann-1', 'Free shipping on orders above ₹499', true) on conflict (id) do nothing;
insert into public.announcements (id, text, is_active) values ('ann-2', 'New 2025-26 editions of MPPSC books now available', true) on conflict (id) do nothing;
