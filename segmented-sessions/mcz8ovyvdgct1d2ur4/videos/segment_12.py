from manim import *

class WellOrderingPrinciple(Scene):
    def construct(self):

        title = Text("Well-Ordering Principle", font_size=36)
        self.play(Write(title))
        self.wait(1)

        explanation = Text("Every non-empty set of natural numbers has a smallest element.", font_size=24)
        self.play(Write(explanation))
        self.wait(2)

        natural_set = VGroup(
            Circle(radius=0.5)
        )
        self.play(Create(natural_set))
        self.wait(1)

        smallest_label = Text("Smallest Element", font_size=20).next_to(natural_set, DOWN)
        self.play(Write(smallest_label))
        self.wait(1)

        self.play(FadeOut(natural_set), FadeOut(smallest_label), FadeOut(explanation))
        self.wait(0.5)

        real_set = Text("Set of Real Numbers: (0, 1)", font_size=24)
        self.play(Write(real_set))
        self.wait(1)

        no_smallest = Text("No Smallest Element", font_size=20).next_to(real_set, DOWN)
        self.play(Write(no_smallest))
        self.wait(1)

        interval_box = Square(side_length=6).move_to(real_set.get_center() + DOWN * 0.5)
        self.play(Create(interval_box))
        self.wait(1)

        conclusion = Text("The Well-Ordering Principle is unique to Natural Numbers!", font_size=24)
        self.play(Write(conclusion))
        self.wait(2)

        self.wait(28.3)  # Adjust to ensure total duration is 36.8 seconds