from manim import *

class StableMatchingProof(Scene):
    def construct(self):

        title = Text("Stable Matching Algorithm", font_size=48)
        self.play(Write(title))
        self.wait(1)

        intro = Text("Does this algorithm *always* produce a stable matching?", font_size=36)
        self.play(Transform(title, intro))
        self.wait(2)

        induction_text = Text("Let's dive into the heart of mathematical proof.", font_size=36)
        self.play(Transform(intro, induction_text))
        self.wait(2)

        induction_visual = Square(side_length=6, color=BLUE)
        induction_label = Text("Proof by Induction", font_size=32).move_to(induction_visual.get_center())
        self.play(Create(induction_visual), Write(induction_label))
        self.wait(2)

        termination_text = Text("How do we *know* it eventually stops?", font_size=36)
        self.play(Transform(induction_text, termination_text))
        self.wait(2)

        candidates = VGroup(*[Square(side_length=1, color=GREEN) for _ in range(5)])
        candidates.arrange(RIGHT, buff=0.5).shift(DOWN)
        self.play(FadeIn(candidates))
        self.wait(2)

        for candidate in candidates:
            self.play(candidate.animate.set_fill(RED, opacity=0.5))
            self.wait(0.5)

        proposals_text = Text("Number of proposals decreases...", font_size=36)
        self.play(Write(proposals_text))
        self.wait(2)

        timeline = Line(LEFT * 3, RIGHT * 3, color=YELLOW)
        self.play(Create(timeline))
        self.wait(1)

        improvement_text = Text("Offers can only improve over time.", font_size=36)
        self.play(Write(improvement_text.next_to(timeline, UP)))
        self.wait(2)

        rogue_couple = VGroup(Circle(radius=0.3, color=RED), Circle(radius=0.3, color=RED))
        rogue_couple.arrange(RIGHT, buff=0.5).shift(UP * 2)
        self.play(FadeIn(rogue_couple))
        rogue_text = Text("Potential Rogue Couple", font_size=36).next_to(rogue_couple, DOWN)
        self.play(Write(rogue_text))
        self.wait(2)

        prevention_text = Text("The algorithm prevents such scenarios!", font_size=36)
        self.play(Transform(rogue_text, prevention_text))
        self.wait(2)

        conclusion_text = Text("Thus, the algorithm *always* terminates and produces a stable matching.", font_size=36)
        self.play(Transform(prevention_text, conclusion_text))
        self.wait(2)

        self.wait(1.6)  # Adjust to ensure total duration is 51.6 seconds