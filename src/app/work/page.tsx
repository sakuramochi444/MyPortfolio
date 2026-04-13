import Link from "next/link";
import { getWorksData } from "@/lib/data-fetching";
import Reveal from "@/components/Reveal";

export const runtime = "edge";

export default async function WorkPage() {
  const works = await getWorksData();

  return (
    <section className="work">
      <Reveal animation="reveal-left">
        <h1>Work</h1>
      </Reveal>
      <div className="work-grid">
        {works.map((work, index) => (
          <Link key={work.id} href={`/work/${work.id}`} className="work-item-link">
            <Reveal animation="reveal-up" className="work-item-block">
              <h3>{work.title}</h3>
              <p>{work.description}</p>
              <div className="mini-skill-icons">
                {work.skills.map((skill, sIndex) => (
                  <span key={sIndex} title={skill.name}>
                    {skill.deviconName ? (
                      <i className={skill.deviconName}></i>
                    ) : skill.siName ? (
                      <i className={skill.siName} style={skill.color ? { color: skill.color } : {}}></i>
                    ) : skill.iconClass ? (
                      <i className={skill.iconClass} style={skill.color ? { color: skill.color } : {}}></i>
                    ) : null}
                  </span>
                ))}
              </div>
            </Reveal>
          </Link>
        ))}
      </div>
    </section>
  );
}
