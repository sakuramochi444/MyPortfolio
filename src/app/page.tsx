import Image from "next/image";
import Link from "next/link";
import { getAboutData } from "@/lib/data-fetching";
import Reveal from "@/components/Reveal";

export const runtime = "edge";

export default async function Home() {
  const data = await getAboutData();
  
  return (
    <section className="about reveal reveal-up active">
      <div className="about-header">
        <h1>About</h1>
        <Image
          src={data.profileIcon}
          alt="Profile Icon"
          className="profile-icon"
          width={80}
          height={80}
        />
      </div>

      <Reveal animation="reveal-left" className="about-section">
        <h2>自己紹介</h2>
        <p style={{ whiteSpace: "pre-wrap" }}>{data.introduction}</p>
      </Reveal>

      <Reveal animation="reveal-right" className="about-section">
        <h2>経歴</h2>
        <div className="timeline">
          {data.timeline.map((item, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-date">{item.date}</div>
              <div className="timeline-content">
                <h3>{item.title}</h3>
                <p className="job-title">{item.jobTitle}</p>
                <p style={{ whiteSpace: "pre-wrap" }}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal animation="reveal-up" className="about-section">
        <h2>製作物</h2>
        <p>
          製作物については<Link href="/work">Workページ</Link>をご覧ください。
        </p>
      </Reveal>

      <Reveal animation="reveal-up" className="about-section">
        <h2>資格</h2>
        {data.qualifications.map((qual, index) => (
          <p key={index}>{qual}</p>
        ))}
      </Reveal>

      <Reveal animation="reveal-up" className="about-section">
        <h2>スキル</h2>
        <div className="skill-grid">
          {data.skills.map((skill, index) => (
            <div key={index} className="skill-item">
              {skill.deviconName ? (
                <i className={skill.deviconName}></i>
              ) : skill.siName ? (
                <i className={skill.siName} style={skill.color ? { color: skill.color } : {}}></i>
              ) : skill.iconClass ? (
                <i className={skill.iconClass} style={skill.color ? { color: skill.color } : {}}></i>
              ) : null}
              <span>{skill.name}</span>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal animation="reveal-up" className="about-section">
        <h2>コンタクト</h2>
        <div className="contact-info">
          ご興味をお持ちいただけましたら、気軽にご連絡ください。<br />
          メール：{data.contact.email}<br />
          学校メール：{data.contact.schoolEmail}<br />
          {data.contact.links && data.contact.links.length > 0 && (
            <div className="contact-links mt-2">
              {data.contact.links.map((link, index) => (
                <div key={index}>
                  {link.label}：
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.url}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
