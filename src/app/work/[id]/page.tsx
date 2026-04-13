import Image from "next/image";
import { getWorksData } from "@/lib/data-fetching";
import Slider from "@/components/Slider";
import { notFound } from "next/navigation";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function WorkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const works = await getWorksData();
  const work = works.find((w) => w.id === id);

  if (!work) {
    notFound();
  }

  return (
    <section className="work-detail">
      <h1>{work.title}</h1>
      
      {work.images.length > 1 ? (
        <Slider images={work.images} />
      ) : (
        <Image
          src={work.images[0]}
          alt={work.title}
          width={900}
          height={500}
          style={{ width: "100%", height: "auto", borderRadius: "12px", marginBottom: "2rem" }}
        />
      )}

      <div className="work-detail-content">
        <h2>プロジェクト概要</h2>
        <p style={{ whiteSpace: "pre-wrap" }}>{work.overview}</p>
        
        {work.role && (
          <>
            <h2>担当範囲</h2>
            <p style={{ whiteSpace: "pre-wrap" }}>{work.role}</p>
          </>
        )}

        <h2>使用技術</h2>
        <div className="skill-grid">
          {work.skills.map((skill, index) => (
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

        {work.links && work.links.length > 0 && (
          <>
            <h2>リンク</h2>
            <div className="space-y-2">
              {work.links.map((link, index) => (
                <p key={index}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-600 hover:underline">
                    <span>🔗</span> {link.label || "リンク"}
                  </a>
                </p>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
